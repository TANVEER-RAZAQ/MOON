const express = require('express');

const {
  requireAdmin,
  requireAuth
} = require('../../core/middleware/require-auth');
const validateRequest = require('../../core/middleware/validate-request');
const detailedController = require('./analytics.detailed.controller');
const { analyticsQuerySchema } = require('./analytics.validator');
const { z } = require('zod');

const router = express.Router();

router.use(requireAuth, requireAdmin);

const buyersQuerySchema = analyticsQuerySchema.extend({
  limit: z.coerce.number().int().positive().max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

const timelineQuerySchema = analyticsQuerySchema.extend({
  granularity: z.enum(['day', 'week', 'month']).default('day'),
});

router.get(
  '/buyers',
  validateRequest({ query: buyersQuerySchema }),
  detailedController.getBuyersSummary
);

router.get(
  '/buyers/:email',
  detailedController.getBuyerDetail
);

router.get(
  '/products/:id/buyers',
  validateRequest({ query: analyticsQuerySchema }),
  detailedController.getProductBuyers
);

router.get(
  '/timeline',
  validateRequest({ query: timelineQuerySchema }),
  detailedController.getTimeline
);

router.get(
  '/geo',
  validateRequest({ query: analyticsQuerySchema }),
  detailedController.getGeoBreakdown
);

module.exports = router;
