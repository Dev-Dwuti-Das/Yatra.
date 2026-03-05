const env = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const { createApp } = require('./src/app');

async function start() {
  await connectDB(env.mongodbUri);
  const app = createApp();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running on port ${env.port}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});
