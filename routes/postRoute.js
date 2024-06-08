const express = require("express");
const {
  getAllPostsController,
  getPostController,
  uploadPostController,
  updatePostController,
  deletePostController,
} = require("../controller/postController");

const authMiddleware = require("../middleware/authMiddle");

const router = express.Router();

//GET ALL POSTS
router.get("/", getAllPostsController);

//GET SINGLE POST
router.get("/:id", getPostController);

//UPLOAD POST
router.post("/upload", uploadPostController);

// UPDATE POST
router.put("/update/:id", updatePostController);

// DELETE SINGLE POST
router.delete("/delete/:id", authMiddleware, deletePostController);

module.exports = router;
