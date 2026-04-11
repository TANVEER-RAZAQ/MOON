// Vercel serverless entry point — exports the Express app as a handler.
// Vercel calls this file directly; app.listen() in server.js is NOT used.
const { validateEnv } = require('../src/config/env');
validateEnv();
module.exports = require('../src/app');
