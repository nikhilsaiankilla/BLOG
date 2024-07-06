const express = require("express");

const router = express.Router();

const { getUserController } = require("./../controller/userController");
const { getAllPostsOfAdmin } = require("../controller/postController");
const { deleteAccountContoller } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddle");

//GET USER DETAILS
router.get("/getUser/:id", getUserController);

//GET POSTS OF THE ADMIN
router.get("/myPosts/:id", getAllPostsOfAdmin);

module.exports = router;
