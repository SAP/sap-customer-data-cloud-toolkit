module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!octokit|@octokit|universal-user-agent|@babel/runtime-corejs3|crypto-browserify)/'],
  moduleNameMapper: {
    '^#crypto$': 'crypto-browserify',
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
}
