import BaseRepository from './base.repository.js';
import Setting from '../models/setting.model.js';

class CmsRepository extends BaseRepository {
  constructor() {
    super(Setting);
  }

  async findPages() {
    return this.model.find({ group: 'cms' });
  }

  async findBySlug(key) {
    return this.model.findOne({ group: 'cms', key });
  }

  async createPage(key, value, description) {
    return this.model.create({ group: 'cms', key, value, type: 'json', isPublic: true, description });
  }

  async updatePage(key, value) {
    return this.model.findOneAndUpdate({ group: 'cms', key }, { $set: { value } }, { new: true });
  }

  async deletePage(key) {
    return this.model.findOneAndDelete({ group: 'cms', key });
  }

  async getBanners() {
    return this.model.find({ group: 'banners', isPublic: true });
  }

  async getFAQs() {
    return this.model.find({ group: 'faqs', isPublic: true });
  }

  async getTestimonials() {
    return this.model.find({ group: 'testimonials', isPublic: true });
  }

  async createItem(group, key, value, description) {
    return this.model.create({ group, key, value, type: 'json', isPublic: true, description });
  }

  async updateItem(group, key, value) {
    return this.model.findOneAndUpdate({ group, key }, { $set: { value } }, { new: true });
  }

  async deleteItem(group, key) {
    return this.model.findOneAndDelete({ group, key });
  }
}

export default new CmsRepository();
