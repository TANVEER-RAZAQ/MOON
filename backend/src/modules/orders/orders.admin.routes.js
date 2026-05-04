const express = require('express');

const { requireAdmin, requireAuth } = require('../../core/middleware/require-auth');
const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');
const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');

const router = express.Router();

// All routes require admin auth
router.use(requireAuth, requireAdmin);

/**
 * GET /admin/orders
 * List all orders with items, payments, and customer info.
 * Supports optional status filter via ?status=pending
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const db = getSupabaseAdminClient();
    let query = db
      .from('orders')
      .select(
        `id, order_number, status, subtotal, shipping_cost, tax, total,
        customer_email, customer_phone, tracking_number, notes,
        created_at, updated_at,
        order_items(id, product_id, product_name, quantity, unit_price, subtotal),
        payments(status, method, razorpay_order_id, razorpay_payment_id)`
      )
      .order('created_at', { ascending: false })
      .limit(200);

    if (req.query.status) {
      query = query.eq('status', req.query.status);
    }

    const { data, error } = await query;
    if (error) throw new ApiError(500, error.message);

    return sendResponse(res, {
      message: 'Orders loaded.',
      data: data ?? []
    });
  })
);

/**
 * GET /admin/orders/:id
 * Single order detail with items, payments, and shipping address.
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = getSupabaseAdminClient();
    const { data, error } = await db
      .from('orders')
      .select(
        `*, order_items(id, product_id, product_name, quantity, unit_price, subtotal),
        payments(status, method, razorpay_order_id, razorpay_payment_id, amount),
        shipping_address:addresses!shipping_address_id(full_name, phone, line_1, line_2, city, state, postal_code, country),
        billing_address:addresses!billing_address_id(full_name, phone, line_1, line_2, city, state, postal_code, country)`
      )
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw new ApiError(500, error.message);
    if (!data) throw new ApiError(404, 'Order not found.');

    return sendResponse(res, {
      message: 'Order loaded.',
      data
    });
  })
);

/**
 * PUT /admin/orders/:id/status
 * Update order status, optionally set tracking number and notes.
 */
router.put(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status, trackingNumber, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const db = getSupabaseAdminClient();
    const patch = { status, updated_at: new Date().toISOString() };
    if (trackingNumber !== undefined) patch.tracking_number = trackingNumber;
    if (notes !== undefined) patch.notes = notes;

    const { data, error } = await db
      .from('orders')
      .update(patch)
      .eq('id', req.params.id)
      .select('id, order_number, status, tracking_number, notes, updated_at')
      .single();

    if (error) throw new ApiError(500, error.message);
    if (!data) throw new ApiError(404, 'Order not found.');

    return sendResponse(res, {
      message: 'Order status updated.',
      data
    });
  })
);

module.exports = router;
