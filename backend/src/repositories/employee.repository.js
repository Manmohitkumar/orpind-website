import BaseRepository from './base.repository.js';
import Employee from '../models/employee.model.js';

class EmployeeRepository extends BaseRepository {
  constructor() {
    super(Employee);
  }

  async create(data) {
    const count = await this.model.countDocuments();
    data.employeeId = `EMP-${String(count + 1).padStart(3, '0')}`;
    return this.model.create(data);
  }

  async findById(id) {
    return this.model.findById(id).populate('userId', 'firstName lastName email phone avatar').populate('roleId', 'name').populate('reportingTo', 'firstName lastName');
  }

  async findByUserId(userId) {
    return this.model.findOne({ userId });
  }

  async softDelete(id) {
    return this.model.findByIdAndUpdate(id, { isActive: false });
  }

  async getByDepartment(department) {
    return this.model.find({ department, isActive: true }).populate('userId', 'firstName lastName');
  }

  async getAll({ page = 1, limit = 20, department, isActive } = {}) {
    const filter = {};
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive;
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      this.model.find(filter).populate('userId', 'firstName lastName email').populate('roleId', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { employees, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

export default new EmployeeRepository();
