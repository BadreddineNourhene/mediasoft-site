import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Export statique (images non optimisées par Next) : les <img> sont voulues, avec width/height et loading="lazy".
  { rules: { "@next/next/no-img-element": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Composants React Bits copiés tels quels depuis le registre officiel (shadcn) : non modifiés ici.
    "src/components/reactbits/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
