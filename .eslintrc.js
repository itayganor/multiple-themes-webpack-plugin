module.exports = {
    parser: '@typescript-eslint/parser',
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            },
        ],
        quotes: [
            'error',
            'single'
        ],
        'comma-dangle': [
            'error',
            'always-multiline',
        ],
        semi: [
            'error',
            'always'
        ],
        'no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': ['error', {functions: false, classes: false}],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-empty-interface': ['off'],
    },
    env: {
        es6: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            'jsx': true,
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    plugins: [
        '@typescript-eslint/eslint-plugin'
    ]
};
