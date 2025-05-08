module.exports = {
  "root": true,
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-duplicate-enum-values": "off"
  }
}