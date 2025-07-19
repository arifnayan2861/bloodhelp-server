const express = require("express");
const {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
  checkAdmin,
  updateUserStatus,
  updateUserRole,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/users", createUser);
router.get("/user/:email", getUserByEmail);
router.patch("/user/:email", verifyToken, updateUser);
router.get("/users", verifyToken, getAllUsers);
router.get("/users/admin/:email", verifyToken, checkAdmin);
router.patch("/user/status/:id", verifyToken, updateUserStatus);
router.patch("/user/role/:id", verifyToken, updateUserRole);

module.exports = router;