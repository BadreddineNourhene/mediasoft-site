/* Couleurs propres à chaque éditeur, partagées par l'en-tête (barres) et le pied de page :
   `bg` reprend le dégradé de l'en-tête de la page, `ink` sert au texte sur bouton blanc,
   `accent` aux petits repères (trait de la rubrique active, étoile, survols). */
export type EditorTheme = { bg: string; ink: string; accent: string };

export const EDITOR_THEMES: Record<string, EditorTheme> = {
  sage: { bg: "linear-gradient(90deg,#03100a 0%,#02120a 30%,#022910 55%,#022d10 100%)", ink: "#022d10", accent: "#00d639" },
  divalto: { bg: "linear-gradient(90deg,#140902 0%,#170a01 30%,#341301 55%,#381401 100%)", ink: "#381401", accent: "#ff5500" },
  powerbi: { bg: "linear-gradient(90deg,#0f0d05 0%,#131005 30%,#342b06 55%,#3b3307 100%)", ink: "#2a2205", accent: "#f5ce0d" },
  bitrix24: { bg: "linear-gradient(90deg,#071a33 0%,#071c35 30%,#0c314d 55%,#0d3450 100%)", ink: "#0d3450", accent: "#2fc6f6" },
};

export const DEFAULT_THEME: EditorTheme = { bg: "#00193a", ink: "#00193a", accent: "#3d8bff" };

export const editorTheme = (current = "") => EDITOR_THEMES[current] ?? DEFAULT_THEME;
