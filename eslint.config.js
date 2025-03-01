import love from "eslint-config-love";

export default [
  {
    ...love,
    files: ["**/*.js", "**/*.ts", "**/*.jsx", "**/*.tsx"],
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "commitlint.config.js",
    ],
  },
];
