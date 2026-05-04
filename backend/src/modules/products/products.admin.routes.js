const express = require('express');
const { z } = require('zod');

const ApiError = require('../../core/errors/api-error');
const { requireAdmin, requireAuth } = require('../../core/middleware/require-auth');
const { revalidateStorefront } = require('../../integrations/revalidate');
const repo = require('./products.repository');

const router = express.Router();

router.use(requireAuth, requireAdmin);

const productWriteSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  discount_price: z.number().positive().nullable().optional(),
  category: z.string().max(100).optional(),
  theme: z.string().max(100).optional(),
  meta_title: z.string().max(255).optional(),
  meta_description: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
});

const imageSchema = z.array(
  z.object({
    url: z.string().url(),
    alt: z.string().max(255).default(''),
    order: z.number().int().min(0),
    blurDataUrl: z.string().nullable().optional(),
  })
).min(0);

router.get('/', async (_req, res, next) => {
  try {
    const products = await repo.adminListProducts();
    res.json({ success: true, message: 'Products fetched', data: products });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = productWriteSchema.required({ name: true, price: true }).safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues.map((i) => i.message).join('; ')));
    }
    const product = await repo.adminCreateProduct({ ...parsed.data, updated_by: req.user.id });
    revalidateStorefront(['/products', '/'], ['products']).catch(() => {});
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = productWriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues.map((i) => i.message).join('; ')));
    }
    const product = await repo.adminUpdateProduct(req.params.id, {
      ...parsed.data,
      updated_by: req.user.id,
    });
    revalidateStorefront(['/products/' + product.slug, '/products', '/'], ['products', 'product-' + product.slug]).catch(() => {});
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await repo.adminDeleteProduct(req.params.id);
    revalidateStorefront(['/products', '/'], ['products']).catch(() => {});
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.put('/:id/images', async (req, res, next) => {
  try {
    const parsed = imageSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues.map((i) => i.message).join('; ')));
    }
    const product = await repo.adminUpdateProduct(req.params.id, {
      images: parsed.data,
      updated_by: req.user.id,
    });
    revalidateStorefront(['/products/' + product.slug], ['product-' + product.slug]).catch(() => {});
    res.json({ product });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
