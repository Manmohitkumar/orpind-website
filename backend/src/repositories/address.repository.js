import BaseRepository from './base.repository.js';
import Address from '../models/address.model.js';

class AddressRepository extends BaseRepository {
  constructor() {
    super(Address);
  }

  async findDefaultByUser(userId) {
    return this.findOne({ userId, isDefault: true });
  }

  async setDefault(userId, addressId) {
    await this.model.updateMany({ userId, _id: { $ne: addressId } }, { isDefault: false });
    return this.model.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });
  }

  async clearDefault(userId) {
    return this.model.updateMany({ userId }, { isDefault: false });
  }
}

export default new AddressRepository();
