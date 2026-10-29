import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['**/out/**', '**/dist/**', '**/node_modules/**', '**/release/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Todo handler IPC pasa por el registro único (ipc.handle/on), nunca ipcMain directo.
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='ipcMain'][callee.property.name=/^(handle|on|once)$/]",
          message: 'Usa el registro único ipc.handle/on (ADR-001), no ipcMain directo.'
        }
      ]
    }
  },
  { files: ['**/*.{js,mjs}'], languageOptions: { globals: { ...globals.node } } },
  {
    files: ['apps/desktop/src/renderer/**/*.{ts,tsx}', 'apps/mobile/src/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules }
  }
);
