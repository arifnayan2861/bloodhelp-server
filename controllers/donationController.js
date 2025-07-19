const Donation = require("../models/Donation");

const donationModel = new Donation();

const createDonationRequest = async (req, res) => {
  try {
    const donation = req.body;
    const result = await donationModel.create(donation);
    res.send(result);
  } catch (error) {
    console.error("Error creating donation request:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getDonationRequestsByUser = async (req, res) => {
  try {
    const status = req.query.status;
    const email = req.params.email;
    const result = await donationModel.findByRequesterEmail(email, status);
    res.send(result);
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getDonationRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await donationModel.findById(id);
    res.send(result);
  } catch (error) {
    console.error("Error fetching donation request:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateDonationRequest = async (req, res) => {
  try {
    const data = req.body;
    const id = req.params.id;
    const result = await donationModel.updateById(id, data);
    res.send(result);
  } catch (error) {
    console.error("Error updating donation request:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteDonationRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await donationModel.deleteById(id);
    res.send(result);
  } catch (error) {
    console.error("Error deleting donation request:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getAllDonationRequests = async (req, res) => {
  try {
    const status = req.query.status;
    const result = await donationModel.findAll(status);
    res.send(result);
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const result = await donationModel.updateStatus(id, status);
    res.send(result);
  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const searchDonors = async (req, res) => {
  try {
    const { bloodGroup, district, upazila } = req.query;
    console.log(req.query);
    
    const donations = await donationModel.searchDonors(bloodGroup, district, upazila);
    res.send(donations);
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).send("An error occurred while fetching donors");
  }
};

module.exports = {
  createDonationRequest,
  getDonationRequestsByUser,
  getDonationRequest,
  updateDonationRequest,
  deleteDonationRequest,
  getAllDonationRequests,
  updateDonationStatus,
  searchDonors,
};