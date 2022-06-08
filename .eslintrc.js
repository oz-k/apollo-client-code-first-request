module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
    ],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-base',
        'airbnb-typescript/base',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/prefer-default-export': 'off',
        '@typescript-eslint/indent': ['error', 4, {
            ignoredNodes: [
                'TSTypeParameterInstantiation',
                'FunctionExpression > .params[decorators.length > 0]',
                'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
                'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
            ],
            SwitchCase: 1,
        }],
        "@typescript-eslint/space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never"
        }],
        'eol-last': ['error', 'never'],
        '@typescript-eslint/object-curly-spacing': 'off',
        'object-curly-newline': ['error', {
            ObjectPattern: {
                multiline: true,
                consistent: true,
            },
        }],
        'no-trailing-spaces': ['error', {
            skipBlankLines: true,
            ignoreComments: true,
        }],
        '@typescript-eslint/semi': ['error', 'always', {
            omitLastInOneLineBlock: true,
        }],
        'max-classes-per-file': 'off',
        'no-case-declarations': 'off',
        '@typescript-eslint/keyword-spacing': ['error', {
            overrides: {
                if: {after: false},
                switch: {after: false},
                for: {after: false},
                while: {after: false},
                catch: {after: false},
            },
        }],
        '@typescript-eslint/ban-ts-comment': ['error', {
            'ts-ignore': 'allow-with-description',
        }],
        'max-len': 'off',
        '@typescript-eslint/return-await': 'off',
        'consistent-return': ['error', {
            treatUndefinedAsUnspecified: true,
        }],
        'class-methods-use-this': 'off',
        'arrow-body-style': 'off',
        '@typescript-eslint/space-infix-ops': 'off',
        'no-underscore-dangle': ['error', {
            allow: ['_id'],
        }],
        'prefer-regex-literals': 'off',
        'new-cap': 'off',
        'no-param-reassign': ['error', {
            props: false
        }],
        'arrow-parens': ['error', 'as-needed'],
        'consistent-return': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/lines-between-class-members': 'off',
    },
};