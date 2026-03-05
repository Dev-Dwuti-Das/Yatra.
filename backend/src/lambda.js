const { connectDB } = require('./config/db');
const env = require('./config/env');
const { createApp } = require('./app');

let isConnected = false;

async function bootstrap() {
  if (!isConnected) {
    await connectDB(env.mongodbUri);
    isConnected = true;
  }

  return createApp();
}

module.exports = { bootstrap };
