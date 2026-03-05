class StorageService {
  async upload(_file) {
    throw new Error('upload(file) must be implemented');
  }

  async remove(_key) {
    throw new Error('remove(key) must be implemented');
  }
}

module.exports = StorageService;
