const asyncHandler = require('../../core/utils/async-handler');
const sendResponse = require('../../core/utils/send-response');
const ordersService = require('./orders.service');

const createOrder = asyncHandler(async (req, res) => {
  const result = await ordersService.createOrder({
    user: req.user,
    input: req.validated?.body ?? req.body
  });

  return sendResponse(res, {
    status: 201,
    message: 'Order created.',
    data: result
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const result = await ordersService.getOrderById({
    user: req.user,
    params: req.validated?.params ?? req.params
  });

  return sendResponse(res, {
    message: 'Order loaded.',
    data: result
  });
});

const listOrders = asyncHandler(async (req, res) => {
  const result = await ordersService.listOrders({
    user: req.user,
    query: req.validated?.query ?? req.query
  });

  return sendResponse(res, {
    message: 'Orders loaded.',
    data: result
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const result = await ordersService.updateStatus({
    user: req.user,
    params: req.validated?.params ?? req.params,
    input: req.validated?.body ?? req.body
  });

  return sendResponse(res, {
    message: 'Order status updated.',
    data: result
  });
});

function generateInvoiceHtml(order) {
  const items = order.order_items || [];
  const itemRows = items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.product_name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">&#x20B9;${Number(item.unit_price).toLocaleString('en-IN')}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">&#x20B9;${Number(item.subtotal).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const addr = order.shipping_address;
  const addrStr = addr
    ? `${addr.full_name}<br>${addr.line_1}${addr.line_2 ? ', ' + addr.line_2 : ''}<br>${addr.city}, ${addr.state} ${addr.postal_code}`
    : 'N/A';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice ${order.order_number}</title>
<style>
  body{font-family:Georgia,serif;max-width:700px;margin:40px auto;color:#222;background:#FAF6EF;padding:20px}
  h1{font-size:28px;color:#D2571B;margin:0}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;border-bottom:2px solid #D2571B;padding-bottom:16px}
  table{width:100%;border-collapse:collapse;margin:24px 0}
  th{background:#D2571B;color:#fff;padding:10px 8px;text-align:left}
  th:last-child,th:nth-child(3){text-align:right}
  th:nth-child(2){text-align:center}
  .totals{text-align:right;margin-top:8px}
  .totals td{padding:4px 8px}
  .total-row td{font-weight:bold;font-size:16px;border-top:2px solid #D2571B;padding-top:8px}
  @media print{body{background:#fff}}
</style>
</head>
<body>
  <div class="header">
    <div><h1>MOON</h1><p style="color:#888;margin:4px 0">Premium Himalayan Products</p></div>
    <div style="text-align:right">
      <div style="font-size:18px;font-weight:bold">INVOICE</div>
      <div>Order: ${order.order_number}</div>
      <div>Date: ${new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>
  </div>
  <div style="margin-bottom:24px">
    <strong>Ship To:</strong><br>
    ${addrStr}
  </div>
  <table>
    <thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
    <tbody>${itemRows}</tbody>
  </table>
  <table class="totals" style="width:300px;margin-left:auto">
    <tr><td>Subtotal</td><td>&#x20B9;${Number(order.subtotal).toLocaleString('en-IN')}</td></tr>
    <tr><td>Shipping</td><td>${Number(order.shipping_cost) === 0 ? 'FREE' : '&#x20B9;' + Number(order.shipping_cost).toLocaleString('en-IN')}</td></tr>
    <tr class="total-row"><td>Total</td><td>&#x20B9;${Number(order.total).toLocaleString('en-IN')}</td></tr>
  </table>
  <p style="margin-top:40px;color:#888;font-size:12px;text-align:center">Thank you for your order! For queries: support@moonbrand.com</p>
</body>
</html>`;
}

const getOrderInvoice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await ordersService.getOrderById({ user: req.user, params: { id } });

  const html = generateInvoiceHtml(order);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `inline; filename="invoice-${order.order_number}.html"`);
  return res.send(html);
});

const cancelOrder = asyncHandler(async (req, res) => {
  const result = await ordersService.cancelOrder({
    params: req.validated?.params ?? req.params
  });
  return sendResponse(res, { message: 'Order cancelled.', data: result });
});

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateStatus,
  getOrderInvoice,
  cancelOrder
};
