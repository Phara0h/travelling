var MAX_CHARS = 256;
var SPACES_PER_TAB = 4;

module.exports = {

    // http://eslint.org/docs/rules/

    'parserOptions': {
        'ecmaVersion': 8
    },

    'env': {
        'browser': true,
        'node': true,
        'amd': true,
        'mocha': true,
        'jasmine': true,
        'phantomjs': true,
        'jquery': true,
        'prototypejs': true,
        'shelljs': true,
    },

    'globals': {
        'angular': false,
        'browser': false,
        '$controller': false,
        '$httpBackend': false,
        '$location': false,
        '$q': false,
        '$rootScope': true,
        '$state': false,
        '$templateCache': false,
        'afterEach': false,
        'angular': false,
        'beforeEach': false,
        'by': false,
        'describe': false,
        'element': false,
        'expect': false,
        'inject': false,
        'it': false,
        'mockData': false,
        'moduleSelect': false,
        'routerHelper': false,
        'sinon': false,
        'specHelper': false,
        'spyOn': false,
        'PDFJS': false,
        'Promise': false,
        'moment': false,
        'cordova': false,
        'StatusBar': false,
        'stripe': false,
        'Map': false,

    },

    'plugins': [
        'security'
    ],

    'extends': [
        'plugin:security/recommended'
    ],

    'rules': {

        ////////// Possible Errors //////////

        'comma-dangle': [2, 'always-multiline'],
        'no-cond-assign': 2,
        'no-constant-condition': 2,
        'no-control-regex': 2,
        'no-debugger': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty-character-class': 2,
        'no-extra-parens': 2, // maybe blocks scopes
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-negated-in-lhs': 2,
        'no-obj-calls': 2,
        'no-unreachable': 2,
        'use-isnan': 2,
        'no-unexpected-multiline': 2,

        ////////// Best Practices //////////

        'curly': 2,
        'dot-location': [2, 'property'],
        'no-alert': 2,
        'no-caller': 1,
        'no-eval': 1,
        'no-multi-spaces': 2,


        ////////// Strict Mode //////////

        'strict': [2, 'global'],

        ////////// Variables //////////

        'no-undef': 2,
        'no-unused-vars': [2, {'vars': 'all', 'args': 'none'}],


        ////////// Node.js //////////

        'handle-callback-err': [1, '^.*(e|E)rr'],

        ////////// Stylistic Issues //////////

        'array-bracket-spacing': [2, 'never'],
        'block-spacing': [2, 'never'],
        'brace-style': [2, '1tbs', {'allowSingleLine': true}],
        'camelcase': ["error", {properties: 'never'}],
        'comma-spacing': [2, {'before': false, 'after': true}],
        'comma-style': [2, 'last'],
        'computed-property-spacing': [2, 'never'],
        'consistent-this': [2, 'self'],
        'eol-last': 2,
        'func-style': [2, 'declaration'],
        'indent': [2, 4, {'SwitchCase': 1}],
        'key-spacing': [2, {'beforeColon': false, 'afterColon': true}],
        'keyword-spacing': 2,
        'lines-around-comment': [
            2,
            {'beforeBlockComment': true, 'beforeLineComment': false, 'allowBlockStart': true},
        ],
        'linebreak-style': [2, 'unix'],
        'new-cap': 2,
        'new-parens': 2,
        'newline-after-var': [2, 'always'],
        'no-array-constructor': 2,
        'no-inline-comments': 2,
        'no-lonely-if': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-multiple-empty-lines': [2, {max: 1}],
        'no-nested-ternary': 2,
        'no-new-object': 2,
        'no-spaced-func': 2,
        'no-trailing-spaces': 2,
        'object-curly-spacing': [2, 'never'],
        'one-var': [2, 'never'],
        'operator-linebreak': [2, 'before'],
        'quote-props': [2, 'as-needed'],
        'quotes': [2, 'single', 'avoid-escape'],
        'semi-spacing': 2,
        'semi': [2, 'always'],
        'sort-vars': 2,
        'space-before-blocks': 2,
        'space-before-function-paren': [2, {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'space-in-parens': [2, 'never'],
        'space-infix-ops': 2,
        'space-unary-ops': [2, {'words': true, 'nonwords': false}],
        'spaced-comment': [2, 'always', {'block': {'exceptions': ['-+*']} }],

        ////////// Security //////////

        'security/detect-non-literal-fs-filename': 'off',
        'security/detect-non-literal-require': 'off',
        'security/detect-object-injection': 'off',

        ////////// Legacy //////////

        'max-depth': 2,
        'max-len': [2, MAX_CHARS, SPACES_PER_TAB]
    },
};
