const express = require('express');

const analyticsRoutes = require('./analytics/analytics.routes');
const authRoutes = require('./auth/auth.routes');
const cartRoutes = require('./cart/cart.routes');
const categoriesAdminRoutes = require('./categories/categories.admin.routes');
const customersAdminRoutes = require('./customers/customers.admin.routes');
const healthRoutes = require('./health/health.routes');
const inventoryRoutes = require('./inventory/inventory.routes');
const notificationsRoutes = require('./notifications/notifications.routes');
const ordersRoutes = require('./orders/orders.routes');
const ordersAdminRoutes = require('./orders/orders.admin.routes');
const paymentsRoutes = require('./payments/payments.routes');
const productsRoutes = require('./products/products.routes');
const productsAdminRoutes = require('./products/products.admin.routes');
const productsUploadRoutes = require('./products/products.upload.routes');
const shippingRoutes = require('./shipping/shipping.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/shipping', shippingRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/admin/analytics', analyticsRoutes);
router.use('/admin/products', productsAdminRoutes);
router.use('/admin/products', productsUploadRoutes);
router.use('/admin/orders', ordersAdminRoutes);
router.use('/admin/customers', customersAdminRoutes);
router.use('/admin/categories', categoriesAdminRoutes);

module.exports = router;
