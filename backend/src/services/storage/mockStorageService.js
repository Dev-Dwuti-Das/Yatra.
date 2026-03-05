const crypto = require('crypto');
const StorageService = require('./storageService');

class MockStorageService extends StorageService {
  async upload(file) {
    const random = crypto.randomBytes(8).toString('hex');
    const safeName = (file.originalname || 'image.bin').replace(/\s+/g, '-').toLowerCase();
    const key = `mock/${Date.now()}-${random}-${safeName}`;

    return {
      key,
      url: `https://mock-storage.local/${key}`
    };
  }

  async remove(_key) {
    return;
  }
}

module.exports = MockStorageService;
