const env = require('../config/env');

async function revalidateStorefront(paths = [], tags = []) {
  const base = env.app.storefrontUrl;
  const secret = env.revalidate.secret;
  if (!secret) return;

  const calls = [
    ...paths.map((path) =>
      fetch(`${base}/api/revalidate?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`, {
        method: 'POST',
      })
    ),
    ...tags.map((tag) =>
      fetch(`${base}/api/revalidate?secret=${encodeURIComponent(secret)}&tag=${encodeURIComponent(tag)}`, {
        method: 'POST',
      })
    ),
  ];

  await Promise.allSettled(calls);
}

module.exports = { revalidateStorefront };
