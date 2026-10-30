"""Prépare le modèle d'embeddings pour un serveur à 512 Mo de mémoire (Render gratuit). À lancer une seule fois.

Le modèle multilingue (paraphrase-multilingual-MiniLM-L12-v2, ONNX de fastembed) contient une table de vocabulaire
de 250 037 mots × 384 dimensions (183 Mo) que le moteur ONNX décompresse entièrement en mémoire (≈ 525 Mo au total).
On la sort du modèle :
  - model/word_embeddings_int8.npy et word_embeddings_scale.npy : la table, quantifiée ligne par ligne en int8
    (+ une échelle par ligne), lue sur disque
    à la demande (seules les lignes des mots de la question sont chargées) ;
  - model/encoder.onnx : le reste du réseau (≈ 40 Mo), qui reçoit directement les vecteurs des mots ;
  - model/sentencepiece.bpe.model : le découpage en mots (SentencePiece, ≈ 40 Mo en mémoire contre ≈ 250 Mo pour
    tokenizer.json), téléchargé depuis le dépôt Hugging Face du modèle.
Utilisé par embedder.py (recherche) et ingest.py (index).

Usage :  python base-rag/export_model.py   (fastembed doit avoir déjà téléchargé le modèle)
"""

import glob
import os
import urllib.request
from pathlib import Path

import numpy as np
import onnx
from onnx import helper, numpy_helper

OUT = Path(__file__).resolve().parent / "model"
TABLE = "embeddings.word_embeddings.weight"
EMBEDS = "word_embeds"


def find_snapshot():
    roots = [os.environ.get("FASTEMBED_CACHE_PATH", ""), os.path.join(os.environ.get("TEMP", "/tmp"), "fastembed_cache")]
    for root in filter(None, roots):
        hits = glob.glob(os.path.join(root, "models--Qdrant--paraphrase-multilingual-MiniLM-L12-v2-onnx-Q", "snapshots", "*"))
        if hits:
            return Path(hits[0])
    raise SystemExit("Modèle introuvable : lancer d'abord ingest.py avec fastembed, ou définir FASTEMBED_CACHE_PATH")


def main():
    snap = find_snapshot()
    model = onnx.load(snap / "model_optimized.onnx")
    graph = model.graph

    init = next(t for t in graph.initializer if t.name == TABLE)
    table = numpy_helper.to_array(init).astype(np.float32)  # (250037, 384)
    gather = next(n for n in graph.node if n.op_type == "Gather" and n.input[0] == TABLE)
    out_name = gather.output[0]

    # Table → int8 par ligne : q = round(x / échelle), échelle = max|x| / 127
    scale = np.abs(table).max(axis=1, keepdims=True) / 127.0
    scale[scale == 0] = 1.0
    q = np.clip(np.round(table / scale), -127, 127).astype(np.int8)
    err = np.abs(q.astype(np.float32) * scale - table).max()

    # Le réseau reçoit les vecteurs des mots (float16, comme la sortie du Gather d'origine) à la place de la table
    graph.node.remove(gather)
    graph.initializer.remove(init)
    graph.input.append(helper.make_tensor_value_info(EMBEDS, onnx.TensorProto.FLOAT16, ["batch", "sequence", table.shape[1]]))
    for node in graph.node:
        for i, name in enumerate(node.input):
            if name == out_name:
                node.input[i] = EMBEDS
    # (pas d'onnx.checker : le modèle utilise des opérations optimisées d'onnxruntime, que le vérificateur standard
    # ne connaît pas ; embedder.py vérifie le résultat en le comparant à fastembed)

    OUT.mkdir(exist_ok=True)
    onnx.save(model, OUT / "encoder.onnx")
    # .npy (et non .npz) : lisible partiellement depuis le disque (np.load(..., mmap_mode="r"))
    np.save(OUT / "word_embeddings_int8.npy", q)
    np.save(OUT / "word_embeddings_scale.npy", scale.astype(np.float32).ravel())
    urllib.request.urlretrieve(
        "https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/resolve/main/sentencepiece.bpe.model",
        OUT / "sentencepiece.bpe.model",
    )
    for f in sorted(OUT.iterdir()):
        print(f"{f.name:24} {f.stat().st_size / 2**20:6.1f} Mo")
    print(f"Erreur maximale de quantification : {err:.5f}")


if __name__ == "__main__":
    main()
