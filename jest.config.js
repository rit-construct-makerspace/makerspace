/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};