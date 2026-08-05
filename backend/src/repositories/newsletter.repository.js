import BaseRepository from './base.repository.js';
import NewsletterSubscriber from '../models/newsletterSubscriber.model.js';

class NewsletterRepository extends BaseRepository {
  constructor() {
    super(NewsletterSubscriber);
  }

  async subscribe(data) {
    return this.model.findOneAndUpdate(
      { email: data.email.toLowerCase() },
      { $set: { status: 'active', subscribedAt: new Date(), ...data }, $unset: { unsubscribedAt: 1 } },
      { new: true, upsert: true }
    );
  }

  async unsubscribe(email) {
    return this.model.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { status: 'unsubscribed', unsubscribedAt: new Date() } },
      { new: true }
    );
  }

  async findByEmail(email) {
    return this.model.findOne({ email: email.toLowerCase() });
  }

  async getActiveSubscribers() {
    return this.model.find({ status: 'active' }).select('email userId tags');
  }

  async findAll({ page = 1, limit = 20, status } = {}) {
    const filter = {};
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [subscribers, total] = await Promise.all([
      this.model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { subscribers, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async importSubscribers(subscribers) {
    const ops = subscribers.map(s => ({
      updateOne: { filter: { email: s.email.toLowerCase() }, update: { $setOnInsert: { ...s, status: 'active', subscribedAt: new Date() } }, upsert: true },
    }));
    return this.model.bulkWrite(ops);
  }
}

export default new NewsletterRepository();
