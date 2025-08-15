const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const react = require("eslint-plugin-react");
const reactRefresh = require("eslint-plugin-react-refresh");
const tsParser = require("@typescript-eslint/parser");
const path = require("node:path");
const { fileURLToPath } = require("node:url");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

module.exports = [
    ...compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react,
            "react-refresh": reactRefresh,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2020,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "prefer-const": "off",
            "react/react-in-jsx-scope": "off", // Disable the need for React to be in scope
            "no-inner-declarations": "off",
            "@typescript-eslint/no-unused-expressions": "off"
            
        },
    }
];
