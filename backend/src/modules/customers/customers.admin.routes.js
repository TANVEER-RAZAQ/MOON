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
 * GET /admin/customers
 * List all customers (role='customer') with order stats.
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const db = getSupabaseAdminClient();

    // Fetch users + aggregate their order data
    const { data: users, error: usersErr } = await db
      .from('users')
      .select('id, email, first_name, last_name, phone, avatar_url, role, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false })
      .limit(500);

    if (usersErr) throw new ApiError(500, usersErr.message);

    // Fetch all orders to aggregate stats per customer
    const { data: orders, error: ordersErr } = await db
      .from('orders')
      .select('user_id, total, status')
      .not('user_id', 'is', null);

    if (ordersErr) throw new ApiError(500, ordersErr.message);

    // Aggregate order stats per user_id
    const statsMap = {};
    for (const order of (orders ?? [])) {
      if (!order.user_id) continue;
      if (!statsMap[order.user_id]) {
        statsMap[order.user_id] = { orderCount: 0, totalSpent: 0 };
      }
      statsMap[order.user_id].orderCount += 1;
      if (order.status !== 'cancelled') {
        statsMap[order.user_id].totalSpent += Number(order.total || 0);
      }
    }

    const customers = (users ?? []).map((u) => ({
      ...u,
      orderCount: statsMap[u.id]?.orderCount ?? 0,
      totalSpent: statsMap[u.id]?.totalSpent ?? 0,
    }));

    return sendResponse(res, {
      message: 'Customers loaded.',
      data: customers
    });
  })
);

/**
 * GET /admin/customers/:id
 * Single customer detail with full order history.
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const db = getSupabaseAdminClient();

    const { data: user, error: userErr } = await db
      .from('users')
      .select('id, email, first_name, last_name, phone, avatar_url, role, created_at, updated_at')
      .eq('id', req.params.id)
      .maybeSingle();

    if (userErr) throw new ApiError(500, userErr.message);
    if (!user) throw new ApiError(404, 'Customer not found.');

    const { data: orders, error: ordersErr } = await db
      .from('orders')
      .select('id, order_number, status, total, created_at, order_items(product_name, quantity)')
      .eq('user_id', req.params.id)
      .order('created_at', { ascending: false });

    if (ordersErr) throw new ApiError(500, ordersErr.message);

    return sendResponse(res, {
      message: 'Customer loaded.',
      data: { ...user, orders: orders ?? [] }
    });
  })
);

module.exports = router;
