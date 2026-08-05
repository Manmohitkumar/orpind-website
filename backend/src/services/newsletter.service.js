import newsletterRepository from '../repositories/newsletter.repository.js';
import { logger } from '../config/logger.js';

class NewsletterService {
  async subscribe(email, { source, tags, userId } = {}) {
    const subscriber = await newsletterRepository.model.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { status: 'active', subscribedAt: new Date(), source, tags, userId }, $unset: { unsubscribedAt: 1 } },
      { new: true, upsert: true }
    );
    return subscriber;
  }

  async unsubscribe(email) {
    return newsletterRepository.model.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { status: 'unsubscribed', unsubscribedAt: new Date() } },
      { new: true }
    );
  }

  async getAll({ page = 1, limit = 20, status } = {}) {
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [subscribers, total] = await Promise.all([
      newsletterRepository.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      newsletterRepository.model.countDocuments(filter),
    ]);
    return { subscribers, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getActiveSubscribers() { return newsletterRepository.model.find({ status: 'active' }).select('email userId tags'); }

  async importSubscribers(subscribers) {
    const ops = subscribers.map(s => ({
      updateOne: { filter: { email: s.email.toLowerCase() }, update: { $setOnInsert: { email: s.email, status: 'active', subscribedAt: new Date(), source: 'import' } }, upsert: true },
    }));
    return newsletterRepository.model.bulkWrite(ops);
  }
}

export default new NewsletterService();
