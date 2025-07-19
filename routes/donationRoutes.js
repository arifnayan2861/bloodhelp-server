const express = require("express");
const {
  createDonationRequest,
  getDonationRequestsByUser,
  getDonationRequest,
  updateDonationRequest,
  deleteDonationRequest,
  getAllDonationRequests,
  updateDonationStatus,
  searchDonors,
} = require("../controllers/donationController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/create-donation-request", verifyToken, createDonationRequest);
router.get("/donation-requests/:email", verifyToken, getDonationRequestsByUser);
router.get("/edit-donation-request/:id", verifyToken, getDonationRequest);
router.patch("/edit-donation-request/:id", verifyToken, updateDonationRequest);
router.delete("/donation-request/:id", verifyToken, deleteDonationRequest);
router.get("/donation-requests", getAllDonationRequests);
router.patch("/donation/status/:id", verifyToken, updateDonationStatus);
router.get("/search-donors", searchDonors);

module.exports = router;