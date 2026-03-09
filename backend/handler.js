const serverless = require('serverless-http');
const env = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const { createApp } = require('./src/app');

let cachedHandler;
let dbConnected = false;

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!dbConnected) {
    await connectDB(env.mongodbUri);
    dbConnected = true;
  }

  if (!cachedHandler) {
    cachedHandler = serverless(createApp());
  }

  return cachedHandler(event, context);
};
