const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

class User {
  constructor() {
    this.collection = getDB().collection("users");
  }

  async create(userData) {
    return await this.collection.insertOne(userData);
  }

  async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async updateByEmail(email, updateData) {
    const filter = { email };
    const user = {
      $set: {
        name: updateData.name,
        photoURL: updateData.photoURL,
        bloodGroup: updateData.bloodGroup,
        "address.district": updateData.address.district,
        "address.upazila": updateData.address.upazila,
      },
    };
    return await this.collection.updateOne(filter, user);
  }

  async updateStatus(id, status) {
    const filter = { _id: new ObjectId(id) };
    const updatedUser = { $set: { status } };
    return await this.collection.updateOne(filter, updatedUser);
  }

  async updateRole(id, role) {
    const filter = { _id: new ObjectId(id) };
    const updatedUser = { $set: { role } };
    return await this.collection.updateOne(filter, updatedUser);
  }

  async checkIfAdmin(email) {
    const user = await this.findByEmail(email);
    return user?.role === "admin";
  }
}

module.exports = User;