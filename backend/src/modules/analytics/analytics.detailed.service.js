const detailedRepo = require('./analytics.detailed.repository');

async function getBuyersSummary(query = {}) {
  return detailedRepo.getBuyersSummary(query);
}

async function getBuyerDetail(email) {
  return detailedRepo.getBuyerDetail(email);
}

async function getProductBuyers(productId, query = {}) {
  return detailedRepo.getProductBuyers(productId, query);
}

async function getTimeline(query = {}) {
  return detailedRepo.getTimeline(query);
}

async function getGeoBreakdown(query = {}) {
  return detailedRepo.getGeoBreakdown(query);
}

module.exports = {
  getBuyerDetail,
  getBuyersSummary,
  getGeoBreakdown,
  getProductBuyers,
  getTimeline,
};
