const express = require("express");

const router = express.Router();

const {
  userRegisterController,
  userLoginController,
  userLogoutController,
  deleteAccountContoller,
  userChangePasswordController,
  resetPasswordController,
} = require("../controller/authController");

const authMiddleware = require("../middleware/authMiddle");

//REGISTER
router.post("/register", userRegisterController);

//LOGIN
router.post("/login", userLoginController);

//LOGOUT
router.post("/logout", userLogoutController);

//CHANGE PASSWORD
router.post("/changePassword", authMiddleware, userChangePasswordController);

//DELETE ACCOUNT
router.delete("/delete", authMiddleware, deleteAccountContoller);

//RESET PASSWORD
router.post("/resetPassword", authMiddleware, resetPasswordController);

module.exports = router;
