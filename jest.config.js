const { createDefaultPreset, pathsToModuleNameMapper } = require('ts-jest');
const JSON5 = require('json5');
const fs = require('fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config({ path: './.env.development' });
const tsJestTransformCfg = createDefaultPreset().transform;

const tsconfigRaw = fs.readFileSync(
  path.resolve(__dirname, './tsconfig.json'),
  'utf-8',
);
const tsconfig = JSON5.parse(tsconfigRaw);

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
