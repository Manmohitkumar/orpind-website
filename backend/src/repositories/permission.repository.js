import BaseRepository from './base.repository.js';
import Permission from '../models/permission.model.js';

class PermissionRepository extends BaseRepository {
  constructor() {
    super(Permission);
  }

  async findByName(name) {
    return this.findOne({ name });
  }

  async findByResource(resource) {
    return this.find({ resource });
  }

  async findByModule(module) {
    return this.find({ module });
  }
}

export default new PermissionRepository();
