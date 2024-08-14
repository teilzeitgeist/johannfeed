import js from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import vue from "eslint-plugin-vue";
import ts from "typescript-eslint";

export default [
  // js
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },

  // ts
  ...ts.configs.recommended,

  // vue
  ...vue.configs["flat/recommended"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    rules: {
      "vue/multi-word-component-names": ["error", { ignores: ["App"] }],
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/block-order": ["error", { order: ["template", "script", "style"] }],
      "vue/component-name-in-template-casing": ["error", "kebab-case"],
      "vue/custom-event-name-casing": "error",
      "vue/define-emits-declaration": "error",
      "vue/define-macros-order": [
        "error",
        {
          order: [
            "defineOptions",
            "defineModel",
            "defineProps",
            "defineEmits",
            "defineSlots",
          ],
          defineExposeLast: true,
        },
      ],
      "vue/define-props-declaration": "error",
      "vue/html-button-has-type": "error",
      "vue/no-multiple-objects-in-class": "warn",
      "vue/no-root-v-if": "warn",
      "vue/no-template-target-blank": "error",
      "vue/no-undef-properties": "warn",
      "vue/no-unused-refs": "warn",
      "vue/no-use-v-else-with-v-for": "error",
      "vue/no-useless-mustaches": "warn",
      "vue/no-useless-v-bind": "warn",
      "vue/no-v-text": "error",
      "vue/padding-line-between-blocks": "warn",
      "vue/prefer-define-options": "error",
      "vue/prefer-separate-static-class": "warn",
      "vue/prefer-true-attribute-shorthand": "warn",
      "vue/require-macro-variable-name": "error",
      "vue/require-typed-ref": "warn",
      "vue/v-for-delimiter-style": "error",
      "vue/valid-define-options": "error",
      "vue/require-default-prop": "off",
    },
  },

  // prettier
  prettier,
  {
    rules: {
      "prettier/prettier": "warn",
    },
  },

  // ignore files
  {
    ignores: ["public/**/*", "vite.config.ts"],
  },
];
