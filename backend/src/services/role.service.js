import roleRepository from '../repositories/role.repository.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

class RoleService {
  async createRole(data) {
    const existing = await roleRepository.findByName(data.name);
    if (existing) {
      throw new AppError('Role already exists', 409);
    }
    return roleRepository.create(data);
  }

  async updateRole(id, data) {
    const role = await roleRepository.model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async deleteRole(id) {
    const role = await roleRepository.findById(id);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return roleRepository.softDelete(id);
  }

  async getRoleById(id) {
    const role = await roleRepository.model.findById(id).populate('permissions');
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async getRoleByName(name) {
    const role = await roleRepository.findByName(name);
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async getAllRoles({ page = 1, limit = 50, isActive } = {}) {
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive;
    return roleRepository.paginate(filter, { page, limit, sort: { level: 1 } });
  }

  async assignPermissions(roleId, permissionIds) {
    const role = await roleRepository.model.findByIdAndUpdate(
      roleId,
      { $addToSet: { permissions: { $each: permissionIds } } },
      { new: true }
    ).populate('permissions');
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }

  async removePermissions(roleId, permissionIds) {
    const role = await roleRepository.model.findByIdAndUpdate(
      roleId,
      { $pullAll: { permissions: permissionIds } },
      { new: true }
    ).populate('permissions');
    if (!role) {
      throw new AppError('Role not found', 404);
    }
    return role;
  }
}

export default new RoleService();
