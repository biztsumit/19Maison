const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-config-prettier');

const ASSET_REQUIRE = String.raw`\.(png|jpg|jpeg|gif|webp|svg)$`;

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'scripts/**',
      // Separate Next.js project with its own toolchain.
      'src/srcWeb/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        require: 'readonly',
        module: 'writable',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Static image assets have no typed import form in React Native.
      '@typescript-eslint/no-require-imports': ['error', { allow: [ASSET_REQUIRE] }],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'react-native/no-unused-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // The customer flow is a light theme built on src/theme/customer.ts.
    // Colour literals are how the screens drifted from the tokens in the first place.
    files: ['src/app/(customer)/**/*.{ts,tsx}', 'src/components/customer/**/*.{ts,tsx}'],
    rules: {
      'react-native/no-color-literals': 'error',
      // This library is built on variant maps (styles[variant]), which the rule
      // cannot resolve statically.
      'react-native/no-unused-styles': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/common/Text',
              message:
                'common/Text defaults to white (dark seller theme). Use @/components/customer/ui/Text.',
            },
          ],
        },
      ],
    },
  },
  prettier,
];
