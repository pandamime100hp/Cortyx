/** @type {import('jest').Config} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  coveragePathIgnorePatterns: ['<rootDir>/tests/mocks/'],
  moduleNameMapper: {
    '^vscode$': '<rootDir>/tests/mocks/vscode.ts',
    '^fetch$': '<rootDir>/tests/mocks/fetch.ts'
  }
};