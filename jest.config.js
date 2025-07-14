module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	roots: ['<rootDir>/src'],
	setupFiles: ['<rootDir>/src/config/jest.setup.ts'],
}
