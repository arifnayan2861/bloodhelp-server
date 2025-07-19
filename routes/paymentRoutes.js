const express = require("express");
const {
  createPaymentIntent,
  storeFund,
  getFunds,
} = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/fund", storeFund);
router.get("/get-funds", verifyToken, getFunds);

module.exports = router;