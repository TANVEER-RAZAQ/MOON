const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const detailedService = require('./analytics.detailed.service');

const getBuyersSummary = asyncHandler(async (req, res) => {
  const result = await detailedService.getBuyersSummary(req.validated?.query ?? req.query);

  return sendResponse(res, {
    message: 'Buyers analytics loaded.',
    data: result
  });
});

const getBuyerDetail = asyncHandler(async (req, res) => {
  const result = await detailedService.getBuyerDetail(req.params.email);

  return sendResponse(res, {
    message: 'Buyer detail loaded.',
    data: result
  });
});

const getProductBuyers = asyncHandler(async (req, res) => {
  const result = await detailedService.getProductBuyers(
    req.params.id,
    req.validated?.query ?? req.query
  );

  return sendResponse(res, {
    message: 'Product buyers loaded.',
    data: result
  });
});

const getTimeline = asyncHandler(async (req, res) => {
  const result = await detailedService.getTimeline(req.validated?.query ?? req.query);

  return sendResponse(res, {
    message: 'Timeline analytics loaded.',
    data: result
  });
});

const getGeoBreakdown = asyncHandler(async (req, res) => {
  const result = await detailedService.getGeoBreakdown(req.validated?.query ?? req.query);

  return sendResponse(res, {
    message: 'Geographic analytics loaded.',
    data: result
  });
});

module.exports = {
  getBuyerDetail,
  getBuyersSummary,
  getGeoBreakdown,
  getProductBuyers,
  getTimeline,
};
