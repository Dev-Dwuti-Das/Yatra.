const mongoose = require('mongoose');

async function connectDB(mongodbUri) {
  await mongoose.connect(mongodbUri);
}

module.exports = { connectDB };
