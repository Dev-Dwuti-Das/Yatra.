const env = require('../../config/env');
const MockStorageService = require('./mockStorageService');

function createStorageService() {
  switch (env.uploadProvider) {
    case 'mock':
      return new MockStorageService();
    default:
      throw new Error(`Unsupported UPLOAD_PROVIDER: ${env.uploadProvider}`);
  }
}

module.exports = { createStorageService };
