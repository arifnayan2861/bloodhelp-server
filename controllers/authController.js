const jwt = require("jsonwebtoken");

const generateToken = async (req, res) => {
  try {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    res.send({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  generateToken,
};