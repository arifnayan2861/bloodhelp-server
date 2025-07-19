const { ObjectId } = require("mongodb");
const { getDB } = require("../config/database");

class Donation {
  constructor() {
    this.collection = getDB().collection("donations");
  }

  async create(donationData) {
    return await this.collection.insertOne(donationData);
  }

  async findById(id) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByRequesterEmail(email, status = null) {
    let query = { requesterEmail: email };
    if (status && status !== "all") {
      query.status = status;
    }
    return await this.collection.find(query).toArray();
  }

  async findAll(status = null) {
    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }
    return await this.collection.find(query).toArray();
  }

  async updateById(id, updateData) {
    const filter = { _id: new ObjectId(id) };
    const updatedRequest = {
      $set: {
        recipientName: updateData.recipientName,
        recipientDistrict: updateData.recipientDistrict,
        recipientUpazila: updateData.recipientUpazila,
        hospitalName: updateData.hospitalName,
        addressLine: updateData.addressLine,
        donationDate: updateData.donationDate,
        donationTime: updateData.donationTime,
        requestMessage: updateData.requestMessage,
      },
    };
    return await this.collection.updateOne(filter, updatedRequest);
  }

  async updateStatus(id, status) {
    const filter = { _id: new ObjectId(id) };
    const updatedStatus = { $set: { status } };
    return await this.collection.updateOne(filter, updatedStatus);
  }

  async deleteById(id) {
    return await this.collection.deleteOne({ _id: new ObjectId(id) });
  }

  async searchDonors(bloodGroup, district, upazila) {
    const query = {
      bloodGroup,
      district,
      upazila,
    };
    return await this.collection.find(query).toArray();
  }
}

module.exports = Donation;