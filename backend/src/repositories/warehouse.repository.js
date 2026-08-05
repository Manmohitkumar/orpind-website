import BaseRepository from './base.repository.js';
import Warehouse from '../models/warehouse.model.js';

class WarehouseRepository extends BaseRepository {
  constructor() {
    super(Warehouse);
  }

  async create(data) {
    const count = await this.model.countDocuments();
    data.code = `WH-${String(count + 1).padStart(3, '0')}`;
    return this.model.create(data);
  }

  async softDelete(id) {
    return this.model.findByIdAndUpdate(id, { isActive: false });
  }

  async getAll() {
    return this.model.find({ isActive: true }).sort({ name: 1 });
  }

  async findByPincode(pincode) {
    return this.model.find({ 'address.pincode': pincode, isActive: true });
  }
}

export default new WarehouseRepository();
