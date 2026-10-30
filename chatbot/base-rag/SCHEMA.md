# Schéma d'une entrée de la base RAG (un objet JSON)

{
  "id": "sage-100-gc-001",                 // unique : <logiciel>-<module>-<numéro>, minuscules, tirets
  "logiciel": "Sage 100",                  // Sage 100 | Sage 50 | Sage (gamme) | Divalto Infinity | Bitrix24 | Microsoft 365 | Outlook | Teams | Excel | Word | OneDrive | Power BI | Mediasoft
  "module": "Gestion commerciale",
  "categorie": "Facturation",
  "type_question": "fonctionnelle",        // generale | fonctionnelle | technique | configuration | depannage | comparaison | integration | commerciale
  "titre": "Créer une facture client",
  "question": "Comment créer une facture client dans Sage 100 ?",
  "formulations": ["Comment facturer un client avec Sage 100 ?", "Faire une facture dans Sage", "..."],  // 3 à 6 variantes réelles, dont du langage courant
  "reponse": "Réponse complète et autonome en français (nomme toujours le logiciel et le module), 300 à 1200 caractères.",
  "etapes": ["Ouvrir ...", "Cliquer sur ...", "..."],   // [] si la source ne documente pas de procédure ; ne jamais inventer d'étapes
  "cas_usage": "Une PME qui ...",          // "" si sans objet
  "mots_cles": ["facture", "facturation", "client", "vente"],
  "nature": "fonctionnalite_native",       // fonctionnalite_native | necessite_configuration | integration | prestation_mediasoft | developpement_specifique
  "source_url": "https://... (URL exacte de la page consultée)",
  "source_titre": "Titre de la page source",
  "date_consultation": "2026-10-30",
  "langue": "fr",                          // langue de la réponse rédigée (toujours fr) ; la langue de la source va dans notes si différente
  "fiabilite": "officielle",               // officielle | officielle_autre_marche (ex. page France/Maroc, disponibilité en Tunisie non confirmée) | source_mediasoft (information donnée par l équipe Mediasoft) | a_confirmer_mediasoft
  "notes": ""                              // ex. "source en anglais", "spécifique à la France", "dépend de la version"
}
