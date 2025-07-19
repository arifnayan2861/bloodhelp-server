const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Fund = require("../models/Fund");

const fundModel = new Fund();

const createPaymentIntent = async (req, res) => {
  try {
    const { fund } = req.body;
    const amount = parseInt(fund * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const storeFund = async (req, res) => {
  try {
    const fundInfo = req.body;
    const result = await fundModel.create(fundInfo);
    res.send(result);
  } catch (error) {
    console.error("Error storing fund:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getFunds = async (req, res) => {
  try {
    const result = await fundModel.findAll();
    res.send(result);
  } catch (error) {
    console.error("Error fetching funds:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createPaymentIntent,
  storeFund,
  getFunds,
};