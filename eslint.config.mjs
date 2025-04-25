import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  { 
    files: ["**/*.{js,mjs,cjs,ts}"], 
    plugins: { js }, 
    extends: ["js/recommended"] 
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts}"], 
    languageOptions: { 
      globals: globals.browser 
    } 
  },
  {
    files: ["**/*.{test,spec}.{js,ts}"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      }
    }
  }
]);