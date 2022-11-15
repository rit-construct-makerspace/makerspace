module.exports = {
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
      },
    },
    moduleFileExtensions: ["ts", "js"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testMatch: ["**/dist/test/**/*.test.(ts|js)"],
    testEnvironment: "node",
    moduleNameMapper: {
      // "src(.*)$": "<rootDir>/src/$1"
    },
};