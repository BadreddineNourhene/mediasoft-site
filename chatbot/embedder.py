"""Calcul des embeddings (vecteurs de sens) avec peu de mémoire : ≈ 150 Mo au lieu de ≈ 525 Mo avec fastembed.

Même modèle que fastembed (paraphrase-multilingual-MiniLM-L12-v2), découpé par base-rag/export_model.py : la table de
vocabulaire (250 037 mots) reste sur le disque et seules les lignes des mots du texte sont lues ; le reste du réseau
tourne avec onnxruntime réglé pour économiser la mémoire. Permet d'héberger le chatbot sur Render gratuit (512 Mo).
"""

import numpy as np
import onnxruntime as ort
import sentencepiece as spm

import config

MODEL_DIR = config.BASE_DIR / "model"
MAX_TOKENS = 128  # même limite que fastembed (et sentence-transformers) pour ce modèle : vecteurs identiques à l'index
# Jetons spéciaux de XLM-RoBERTa (convention fairseq) : les identifiants SentencePiece sont décalés de 1
BOS, PAD, EOS, UNK, OFFSET = 0, 1, 2, 3, 1


class Embedder:
    def __init__(self):
        so = ort.SessionOptions()
        # Pas de réserve mémoire préallouée ni de réoptimisation au chargement ; un seul fil (0,1 CPU sur Render)
        so.enable_cpu_mem_arena = False
        so.enable_mem_pattern = False
        so.intra_op_num_threads = 1
        so.inter_op_num_threads = 1
        so.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_BASIC
        self.session = ort.InferenceSession(str(MODEL_DIR / "encoder.onnx"), so, providers=["CPUExecutionProvider"])
        self.inputs = {i.name for i in self.session.get_inputs()}
        # Découpage SentencePiece (≈ 40 Mo en mémoire, contre ≈ 250 Mo pour tokenizer.json) : mêmes identifiants,
        # vérifié sur tous les passages de la base
        self.sp = spm.SentencePieceProcessor(model_file=str(MODEL_DIR / "sentencepiece.bpe.model"))
        # Table int8 lue à la demande depuis le disque (mmap) : seules les pages des mots utilisés sont chargées
        self.table = np.load(MODEL_DIR / "word_embeddings_int8.npy", mmap_mode="r")
        self.scale = np.load(MODEL_DIR / "word_embeddings_scale.npy")

    def _ids(self, text):
        unk = self.sp.unk_id()
        ids = [UNK if i == unk else i + OFFSET for i in self.sp.encode(text)]
        return [BOS] + ids[: MAX_TOKENS - 2] + [EOS]

    def _batch(self, texts):
        enc = [self._ids(t) for t in texts]
        n = max(len(e) for e in enc)
        ids = np.full((len(enc), n), PAD, dtype=np.int64)
        mask = np.zeros((len(enc), n), dtype=np.int64)
        for i, e in enumerate(enc):
            ids[i, : len(e)] = e
            mask[i, : len(e)] = 1
        words = (self.table[ids].astype(np.float32) * self.scale[ids][..., None]).astype(np.float16)
        feeds = {"input_ids": ids, "attention_mask": mask, "word_embeds": words}
        if "token_type_ids" in self.inputs:
            feeds["token_type_ids"] = np.zeros_like(ids)
        hidden = self.session.run(None, {k: v for k, v in feeds.items() if k in self.inputs})[0].astype(np.float32)
        # Moyenne des vecteurs des mots (hors remplissage), comme sentence-transformers / fastembed pour ce modèle
        m = mask[..., None].astype(np.float32)
        return (hidden * m).sum(axis=1) / np.maximum(m.sum(axis=1), 1e-9)

    def embed(self, texts, batch_size=16):
        """Vecteurs normalisés (norme 1), un par texte."""
        texts = list(texts)
        out = [self._batch(texts[i : i + batch_size]) for i in range(0, len(texts), batch_size)]
        v = np.concatenate(out).astype(np.float32)
        return v / (np.linalg.norm(v, axis=1, keepdims=True) + 1e-12)
