import employeeRepository from '../repositories/employee.repository.js';

class EmployeeService {
  async createEmployee(data) {
    const count = await employeeRepository.model.countDocuments();
    data.employeeId = `EMP-${String(count + 1).padStart(3, '0')}`;
    return employeeRepository.model.create(data);
  }

  async updateEmployee(id, data) { return employeeRepository.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('userId', 'firstName lastName email').populate('roleId', 'name'); }

  async softDelete(id) { return employeeRepository.model.findByIdAndUpdate(id, { isActive: false }); }

  async getAllEmployees({ page = 1, limit = 20, department, isActive } = {}) {
    const filter = {};
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive;
    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      employeeRepository.model.find(filter).populate('userId', 'firstName lastName email').populate('roleId', 'name').populate('reportingTo', 'firstName lastName').sort({ createdAt: -1 }).skip(skip).limit(limit),
      employeeRepository.model.countDocuments(filter),
    ]);
    return { employees, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getEmployeeById(id) { return employeeRepository.model.findById(id).populate('userId', 'firstName lastName email phone').populate('roleId', 'name').populate('reportingTo', 'firstName lastName'); }

  async deleteEmployee(id) { return this.softDelete(id); }

  async getByDepartment(department) { return employeeRepository.model.find({ department, isActive: true }).populate('userId', 'firstName lastName'); }
}

export default new EmployeeService();
