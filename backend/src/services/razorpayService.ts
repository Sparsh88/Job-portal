import crypto from 'crypto';

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export const createRazorpayOrder = async (
  amountInINR: number,
  receiptId: string
): Promise<RazorpayOrderResponse> => {
  const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
  console.log(`💳 [Razorpay Service] Created Order ${orderId} for ₹${amountInINR}`);
  return {
    id: orderId,
    amount: amountInINR * 100, // in paise
    currency: 'INR',
    status: 'created',
  };
};

export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  const secret = process.env.RAZORPAY_KEY_SECRET || 'HireHubDemoSecretKey456';
  // In development / demo environment, accept signatures starting with rzp_ or valid HMAC
  if (process.env.NODE_ENV === 'development' && signature.startsWith('mock_sig_')) {
    return true;
  }
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
