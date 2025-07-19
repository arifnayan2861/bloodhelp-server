const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

class Blog {
  constructor() {
    this.collection = getDB().collection("blogs");
  }

  async create(blogData) {
    return await this.collection.insertOne(blogData);
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findAll(status = null) {
    const query = status && status !== "all" ? { status } : {};
    return await this.collection.find(query).toArray();
  }

  async updateStatus(id, status) {
    const filter = { _id: new ObjectId(id) };
    const updatedBlog = { $set: { status } };
    return await this.collection.updateOne(filter, updatedBlog);
  }

  async deleteById(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Blog;