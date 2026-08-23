const lintStagedConfig = {
  "*.{js,cjs,mjs,ts,tsx}": [
    "eslint --fix --max-warnings=0 --no-warn-ignored",
    "prettier --write",
  ],
  "*.{css,json,jsonc,md,mdx,yaml,yml}": "prettier --write",
};

export default lintStagedConfig;
