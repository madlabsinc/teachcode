
module.exports = {
    extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
    plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
    env: {
      "browser": true,
      "es6": true,
      "node": true
    },
    parserOptions: {
      sourceType: "module",
      ecmaVersion: "2018",
      allowImportExportEverywhere: false,
      ecmaFeatures: {
        globalReturn: false,
      }
    },
    rules: {
      "no-console": 0,
      'prettier/prettier': [ // customizing prettier rules (unfortunately not many of them are customizable)
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
        },
      ],
      eqeqeq: ['error', 'always'], // adding some custom ESLint rules
    },
  };
