class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findById(id, options = {}) {
    const query = this.model.findById(id);
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    return query;
  }

  async findOne(filter = {}, options = {}) {
    const query = this.model.findOne({ ...filter, isDeleted: { $ne: true } });
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    if (options.sort) query.sort(options.sort);
    return query;
  }

  async find(filter = {}, options = {}) {
    const query = this.model.find({ ...filter, isDeleted: { $ne: true } });
    if (options.populate) query.populate(options.populate);
    if (options.select) query.select(options.select);
    if (options.sort) query.sort(options.sort);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    return query;
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data, options = {}) {
    const doc = await this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: data },
      { new: true, runValidators: true, ...options }
    );
    if (!doc) return null;
    return doc;
  }

  async delete(id) {
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true } },
      { new: true }
    );
  }

  async softDelete(id) {
    const doc = await this.model.findById(id);
    if (!doc) return null;
    if (typeof doc.softDelete === 'function') {
      await doc.softDelete();
    } else {
      doc.isDeleted = true;
      await doc.save();
    }
    return doc;
  }

  async hardDelete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return this.model.countDocuments({ ...filter, isDeleted: { $ne: true } });
  }

  async exists(filter = {}) {
    return this.model.exists({ ...filter, isDeleted: { $ne: true } });
  }

  async paginate(filter = {}, { page = 1, limit = 20, sort = { createdAt: -1 }, populate } = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.find(filter, { sort, skip, limit, populate }),
      this.count(filter),
    ]);
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async bulkWrite(operations) {
    return this.model.bulkWrite(operations);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }

  async distinct(field, filter = {}) {
    return this.model.distinct(field, { ...filter, isDeleted: { $ne: true } });
  }
}

export default BaseRepository;
