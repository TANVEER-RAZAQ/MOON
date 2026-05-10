const express = require('express');

const { requireAuth } = require('../../core/middleware/require-auth');
const { paymentsLimiter } = require('../../core/middleware/rate-limit');
const validateRequest = require('../../core/middleware/validate-request');
const paymentsController = require('./payments.controller');
const {
  createRazorpayOrderSchema,
  paymentStatusParamsSchema,
  verifyPaymentSchema,
  quickOrderSchema,
  quickVerifySchema
} = require('./payments.validator');

const router = express.Router();

// Webhook route — must use raw body parser so HMAC signature verification works.
// This must be registered BEFORE any express.json() body-parsing routes.
router.post(
  '/webhook/razorpay',
  express.raw({ type: 'application/json' }),
  paymentsController.razorpayWebhook
);

// Guest-accessible: create order and verify payment (storefront is unauthenticated)
router.post(
  '/razorpay',
  paymentsLimiter,
  validateRequest({ body: createRazorpayOrderSchema }),
  paymentsController.createRazorpayOrder
);
router.post(
  '/verify',
  paymentsLimiter,
  validateRequest({ body: verifyPaymentSchema }),
  paymentsController.verifyPayment
);

// Simple checkout — no DB order required (static site / guest checkout)
router.post(
  '/quick-order',
  paymentsLimiter,
  validateRequest({ body: quickOrderSchema }),
  paymentsController.quickOrder
);
router.post(
  '/quick-verify',
  paymentsLimiter,
  validateRequest({ body: quickVerifySchema }),
  paymentsController.quickVerify
);

// Admin / auth-gated routes
router.use(requireAuth);

router.get(
  '/:orderId',
  validateRequest({ params: paymentStatusParamsSchema }),
  paymentsController.getPaymentStatus
);

module.exports = router;
