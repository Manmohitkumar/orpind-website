import settingsRepository from '../repositories/settings.repository.js';

class SettingsService {
  async getSettings() { return settingsRepository.model.find({}).sort({ group: 1, key: 1 }); }

  async getSettingsByGroup(group) { return settingsRepository.model.find({ group }); }

  async getSetting(group, key) { return settingsRepository.model.findOne({ group, key }); }

  async updateSetting(group, key, value, updatedBy) {
    return settingsRepository.model.findOneAndUpdate(
      { group, key },
      { $set: { value, updatedBy } },
      { new: true, upsert: true }
    );
  }

  async getPublicSettings() { return settingsRepository.model.find({ isPublic: true }).select('group key value type'); }
}

export default new SettingsService();
