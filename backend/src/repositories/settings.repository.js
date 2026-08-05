import BaseRepository from './base.repository.js';
import Setting from '../models/setting.model.js';

class SettingsRepository extends BaseRepository {
  constructor() {
    super(Setting);
  }

  async getSetting(group, key) {
    return this.model.findOne({ group, key });
  }

  async getSettingsByGroup(group) {
    return this.model.find({ group });
  }

  async getAll() {
    return this.model.find({}).sort({ group: 1, key: 1 });
  }

  async upsert(group, key, value, type = 'string', isPublic = false, updatedBy) {
    return this.model.findOneAndUpdate(
      { group, key },
      { $set: { value, type, isPublic, updatedBy } },
      { new: true, upsert: true, runValidators: true }
    );
  }

  async delete(group, key) {
    return this.model.findOneAndDelete({ group, key });
  }

  async getPublicSettings() {
    return this.model.find({ isPublic: true }).select('group key value type');
  }
}

export default new SettingsRepository();
