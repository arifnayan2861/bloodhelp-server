const Blog = require("../models/Blog");

const blogModel = new Blog();

const getAllBlogs = async (req, res) => {
  try {
    const status = req.query.status;
    const blogs = await blogModel.findAll(status);
    res.send(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = req.body;
    const result = await blogModel.create(blog);
    res.send(result);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await blogModel.deleteById(id);
    res.send(result);
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateBlogStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    const result = await blogModel.updateStatus(id, status);
    res.send(result);
  } catch (error) {
    console.error("Error updating blog status:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await blogModel.findById(id);
    res.send(result);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlog,
  updateBlogStatus,
  getBlog,
};