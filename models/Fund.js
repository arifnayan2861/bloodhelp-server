const { getDB } = require("../config/database");

class Fund {
  constructor() {
    this.collection = getDB().collection("funds");
  }

  async create(fundData) {
    return await this.collection.insertOne(fundData);
  }

  async findAll() {
    return await this.collection.find().toArray();
  }
}

module.exports = Fund;