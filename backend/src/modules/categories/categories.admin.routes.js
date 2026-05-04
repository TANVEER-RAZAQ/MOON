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
 * GET /admin/categories
 * Derive distinct categories and themes from the products table.
 * Returns each category with its product count.
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const db = getSupabaseAdminClient();

    const { data, error } = await db
      .from('products')
      .select('category, theme, is_active');

    if (error) throw new ApiError(500, error.message);

    // Aggregate category stats
    const catMap = {};
    for (const p of (data ?? [])) {
      const cat = p.category || 'Uncategorized';
      if (!catMap[cat]) {
        catMap[cat] = { name: cat, productCount: 0, activeCount: 0, themes: new Set() };
      }
      catMap[cat].productCount += 1;
      if (p.is_active) catMap[cat].activeCount += 1;
      if (p.theme) catMap[cat].themes.add(p.theme);
    }

    const categories = Object.values(catMap).map((c) => ({
      name: c.name,
      productCount: c.productCount,
      activeCount: c.activeCount,
      themes: [...c.themes],
    }));

    // Sort by product count descending
    categories.sort((a, b) => b.productCount - a.productCount);

    return sendResponse(res, {
      message: 'Categories loaded.',
      data: categories
    });
  })
);

module.exports = router;
