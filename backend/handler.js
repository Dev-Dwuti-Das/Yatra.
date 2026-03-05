const { bootstrap } = require('./src/lambda');

/**
 * Lambda entrypoint placeholder. Wire this to a serverless adapter
 * (for example serverless-http) in your deployment runtime.
 */
module.exports.handler = bootstrap;
