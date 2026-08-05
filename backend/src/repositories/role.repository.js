import BaseRepository from './base.repository.js';
import Role from '../models/role.model.js';

class RoleRepository extends BaseRepository {
  constructor() {
    super(Role);
  }

  async findByName(name) {
    return this.findOne({ name });
  }

  async findByLevel(level) {
    return this.find({ level: { $lte: level } }).sort({ level: 1 });
  }

  async findDefault() {
    return this.findOne({ isDefault: true });
  }
}

export default new RoleRepository();
