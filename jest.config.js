module.exports = {
    verbose: true,
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    roots: [
        'test',
    ],
    testRegex: '.*\\.test\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1',
        src: '<rootDir>/src',
    },
};