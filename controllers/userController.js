const User = require("../models/User");

const userModel = new User();

const createUser = async (req, res) => {
  try {
    const userData = req.body;
    const existingUser = await userModel.findByEmail(userData.email);
    
    if (existingUser) {
      return res.send({ message: "user already exists", insertedId: null });
    }
    
    const result = await userModel.create(userData);
    res.send(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await userModel.findByEmail(email);
    res.send(result);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUserInfo = req.body;
    const result = await userModel.updateByEmail(email, updatedUserInfo);
    res.send(result);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await userModel.findAll();
    res.send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const checkAdmin = async (req, res) => {
  try {
    const email = req.params.email;
    const admin = await userModel.checkIfAdmin(email);
    res.send({ admin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const result = await userModel.updateStatus(id, status);
    res.send(result);
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const id = req.params.id;
    const result = await userModel.updateRole(id, role);
    res.send(result);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
  checkAdmin,
  updateUserStatus,
  updateUserRole,
};