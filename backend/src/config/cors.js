const env = require('./env');

// FRONTEND_URL supports comma-separated values for monorepo multi-origin:
// e.g. "https://www.moonnaturallyyours.com,https://admin.moonnaturallyyours.com"
const allowedOrigins = new Set(
  [
    ...env.app.frontendUrl.split(','),
    env.app.storefrontUrl
  ]
    .map((u) => u?.trim())
    .filter(Boolean)
);

// Any localhost or 127.0.0.1 origin is allowed in development regardless of port
function isLocalOrigin(origin) {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    // Allow requests with no origin (e.g., Render health checks, server-to-server webhooks, mobile apps)
    // CORS is a browser security mechanism; blocking no-origin requests breaks non-browser clients.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // In development allow any localhost port (Vite :5173, CRA :3000, etc.)
    if (!env.app.isProduction && isLocalOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: origin "${origin}" is not allowed.`));
  }
};

module.exports = corsOptions;
