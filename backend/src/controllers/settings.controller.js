import settingsService from '../services/settings.service.js';

class SettingsController {
  async getSettings(req, res, next) {
    try {
      const data = await settingsService.getSettings();
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getSettingsByGroup(req, res, next) {
    try {
      const data = await settingsService.getSettingsByGroup(req.params.group);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateSetting(req, res, next) {
    try {
      const { group, key, value } = req.body;
      const data = await settingsService.updateSetting({ group, key, value });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const settingsController = new SettingsController();

export const {
  getSettings,
  getSettingsByGroup,
  updateSetting,
} = settingsController;

export default settingsController;