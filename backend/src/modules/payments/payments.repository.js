const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const ApiError = require('../../core/errors/api-error');

async function createPaymentRecord({ orderId, amount, method = 'unknown' }) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('payments')
    .insert({
      order_id: orderId,
      amount,
      status: 'pending',
      method,
      provider: 'razorpay'
    })
    .select('*')
    .single();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function getPaymentByOrderId(orderId) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function updatePaymentStatus({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  status,
  method,
  rawResponse
}) {
  const db = getSupabaseAdminClient();
  const patch = { status };
  if (razorpayOrderId) patch.razorpay_order_id = razorpayOrderId;
  if (razorpayPaymentId) patch.razorpay_payment_id = razorpayPaymentId;
  if (razorpaySignature) patch.razorpay_signature = razorpaySignature;
  if (method) patch.method = method;
  if (rawResponse) patch.raw_response = rawResponse;

  const { data, error } = await db
    .from('payments')
    .update(patch)
    .eq('order_id', orderId)
    .select('*')
    .single();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function findByRazorpayOrderId(razorpayOrderId) {
  const db = getSupabaseAdminClient();
  const { data, error } = await db
    .from('payments')
    .select('*')
    .eq('razorpay_order_id', razorpayOrderId)
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

async function updateByRazorpayOrderId(razorpayOrderId, { status, razorpay_payment_id, method, raw_response }) {
  const db = getSupabaseAdminClient();
  const patch = { status };
  if (razorpay_payment_id) patch.razorpay_payment_id = razorpay_payment_id;
  if (method) patch.method = method;
  if (raw_response) patch.raw_response = raw_response;

  const { data, error } = await db
    .from('payments')
    .update(patch)
    .eq('razorpay_order_id', razorpayOrderId)
    .select('*')
    .maybeSingle();
  if (error) throw new ApiError(500, error.message);
  return data;
}

module.exports = {
  createPaymentRecord,
  getPaymentByOrderId,
  updatePaymentStatus,
  findByRazorpayOrderId,
  updateByRazorpayOrderId
};
