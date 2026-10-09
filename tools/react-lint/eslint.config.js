// Keep React rules on their supported ESLint major; main lint uses ESLint 10.
import react from 'eslint-plugin-react';
import reactHooks from '../../node_modules/eslint-plugin-react-hooks/index.js';
import tseslint from '../../node_modules/typescript-eslint/dist/index.js';
export default [
  { ignores: ['**/dist/**', '**/node_modules/**'] },
  {
    files: ['examples/playground/**/*.ts', 'examples/playground/**/*.tsx'],
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: { ...react.configs.recommended.rules, 'react/react-in-jsx-scope': 'off', 'react/prop-types': 'off' },
  },
];
