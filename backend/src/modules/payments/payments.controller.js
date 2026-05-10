const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const paymentsService = require('./payments.service');

const createRazorpayOrder = asyncHandler(async (req, res) => {
  const result = await paymentsService.createRazorpayOrder(
    req.validated?.body ?? req.body
  );

  return sendResponse(res, {
    status: 201,
    message: 'Razorpay order created.',
    data: result
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const result = await paymentsService.verifyPayment(req.validated?.body ?? req.body);

  return sendResponse(res, {
    message: 'Payment verified.',
    data: result
  });
});

const getPaymentStatus = asyncHandler(async (req, res) => {
  const result = await paymentsService.getPaymentStatus(
    req.validated?.params ?? req.params
  );

  return sendResponse(res, {
    message: 'Payment status loaded.',
    data: result
  });
});

const quickOrder = asyncHandler(async (req, res) => {
  const result = await paymentsService.quickOrder(req.validated?.body ?? req.body);
  return sendResponse(res, { status: 201, message: 'Razorpay order created.', data: result });
});

const quickVerify = asyncHandler(async (req, res) => {
  const result = await paymentsService.quickVerify(req.validated?.body ?? req.body);
  return sendResponse(res, { message: 'Payment verified.', data: result });
});

const razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) return res.status(400).json({ error: 'Missing signature' });

    const result = await paymentsService.handleRazorpayWebhook(req.body, signature);
    return res.status(200).json(result);
  } catch (err) {
    if (err.statusCode === 400) return res.status(400).json({ error: err.message });
    console.error('[webhook] Razorpay webhook error:', err);
    // Always return 200 to Razorpay so it does not retry on internal errors
    return res.status(200).json({ received: true });
  }
};

module.exports = {
  createRazorpayOrder,
  getPaymentStatus,
  verifyPayment,
  quickOrder,
  quickVerify,
  razorpayWebhook
};
