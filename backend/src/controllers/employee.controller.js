import employeeService from '../services/employee.service.js';

class EmployeeController {
  async createEmployee(req, res, next) {
    try {
      const data = await employeeService.createEmployee(req.body);
      res.status(201).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async updateEmployee(req, res, next) {
    try {
      const data = await employeeService.updateEmployee(req.params.id, req.body);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async deleteEmployee(req, res, next) {
    try {
      const data = await employeeService.deleteEmployee(req.params.id);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getAllEmployees(req, res, next) {
    try {
      const { department, isActive, page, limit } = req.query;
      const data = await employeeService.getAllEmployees({ department, isActive, page, limit });
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }

  async getByDepartment(req, res, next) {
    try {
      const data = await employeeService.getByDepartment(req.params.department);
      res.status(200).json({ success: true, data, meta: { requestId: req.requestId, timestamp: new Date().toISOString() } });
    } catch (error) {
      next(error);
    }
  }
}

const employeeController = new EmployeeController();

export const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAllEmployees,
  getByDepartment,
} = employeeController;

export default employeeController;