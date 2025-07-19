const express = require("express");
const {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlogStatus,
  getBlog,
} = require("../controllers/blogController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/blogs", getAllBlogs);
router.post("/blogs", verifyToken, createBlog);
router.delete("/blogs/:id", verifyToken, deleteBlog);
router.patch("/blogs/status/:id", verifyToken, updateBlogStatus);
router.get("/blogs/:id", getBlog);

module.exports = router;