/** @type {import("prettier").Config} */
const config = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  printWidth: 120,
  singleQuote: true,
  semi: true,
  importOrder: ['^ng-zorro-antd/(.*)$', '^@financial-project/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
};

module.exports = config;
