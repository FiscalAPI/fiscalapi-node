const { createDefaultPreset } = require('ts-jest');

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  ...createDefaultPreset({ tsconfig: '<rootDir>/tsconfig.test.json' }),
};
