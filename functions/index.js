const admin = require('firebase-admin');
const { onCall, HttpsError } = require('firebase-functions/v2/https');

admin.initializeApp();

exports.createPaymentIntent = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Sign in before paying.');
  }

  const { orderId, provider } = request.data || {};
  if (!orderId || !provider) {
    throw new HttpsError('invalid-argument', 'orderId and provider are required.');
  }

  const orderRef = admin.firestore().collection('orders').doc(orderId);
  const orderSnapshot = await orderRef.get();

  if (!orderSnapshot.exists) {
    throw new HttpsError('not-found', 'Order not found.');
  }

  const order = orderSnapshot.data();
  if (order.userId !== request.auth.uid) {
    throw new HttpsError('permission-denied', 'You can only pay for your own order.');
  }

  await orderRef.update({
    paymentProvider: provider,
    paymentStatus: 'payment-request-created',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    orderId,
    provider,
    amount: order.total,
    status: 'payment-request-created'
  };
});
