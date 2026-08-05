export class PaymentProvider {
  async createOrder(order) {
    throw new Error('Not implemented');
  }

  async verifyPayment(data) {
    throw new Error('Not implemented');
  }

  async refund(paymentId, amount, reason) {
    throw new Error('Not implemented');
  }

  async getStatus(paymentId) {
    throw new Error('Not implemented');
  }

  verifyWebhookSignature(payload, signature) {
    throw new Error('Not implemented');
  }
}
