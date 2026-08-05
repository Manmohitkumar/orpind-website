import permissionRepository from '../repositories/permission.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

class PermissionService {
  async createPermission(data) {
    const existing = await permissionRepository.findByName(data.name);
    if (existing) {
      throw new AppError('Permission already exists', 409);
    }
    return permissionRepository.create(data);
  }

  async updatePermission(id, data) {
    const permission = await permissionRepository.model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    if (!permission) {
      throw new AppError('Permission not found', 404);
    }
    return permission;
  }

  async deletePermission(id) {
    const permission = await permissionRepository.findById(id);
    if (!permission) {
      throw new AppError('Permission not found', 404);
    }
    return permissionRepository.softDelete(id);
  }

  async getPermissionById(id) {
    const permission = await permissionRepository.findOne({ _id: id });
    if (!permission) {
      throw new AppError('Permission not found', 404);
    }
    return permission;
  }

  async getAllPermissions({ page = 1, limit = 100, resource, module } = {}) {
    const filter = {};
    if (resource) filter.resource = resource;
    if (module) filter.module = module;
    return permissionRepository.paginate(filter, { page, limit, sort: { resource: 1, action: 1 } });
  }

  async getByResource(resource) {
    return permissionRepository.findByResource(resource);
  }

  async bulkCreate(permissions) {
    return permissionRepository.bulkWrite(
      permissions.map(p => ({
        updateOne: {
          filter: { name: p.name },
          update: { $setOnInsert: p },
          upsert: true,
        },
      }))
    );
  }
}

export default new PermissionService();
