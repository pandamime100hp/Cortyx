/** @type {import('jest').Config} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '^vscode$': '<rootDir>/tests/mocks/vscode.ts'
  },
};