const { db } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER CONTROLLER

const userRegisterController = async (req, res) => {
  //CHECK WEATHER USER EXIST OR NOT
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.email], (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (data.length) {
      return res.status(409).send("user already exist!");
    }

    //HASHING THE PASSWORD

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users(`username`,`email`,`password`, `userImg`, `question`) VALUES (?)";

    const values = [
      req.body.username,
      req.body.email,
      hash,
      req.body.image,
      req.body.question,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send("something went wrong");
      }

      return res.status(200).send("registered successfully");
    });
  });
};

//LOGIN CONTROLLER

const userLoginController = async (req, res) => {
  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [req.body.email], async (err, data) => {
    // if error occurs return error
    if (err) {
      return res.status(500).send(err);
    }

    // if there is no data then return user not found
    if (data.length == 0) {
      return res.status(404).send("User not found");
    }

    const user = data[0];

    // Extract hashed password from the retrieved data
    const hashedPassword = user.password;

    // Compare passwords
    const match = await bcrypt.compare(req.body.password, hashedPassword);
    if (!match) {
      return res.status(500).send("Password doesn't match!");
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECURITY,
      { expiresIn: "1h" }
    );

    user.password = undefined;

    const newUser = {
      ...user,
      token,
    };

    return res.status(200).send(newUser);
  });
};

//LOGOUT CONTROLLER

const userLogoutController = async (req, res) => {
  try {
    const blacklistedTokens = new Set();
    const token = req.headers["authorization"].split(" ")[1];

    if (!token) return res.status(500).send("token not provided");

    blacklistedTokens.add(token);

    return res.status(200).send("Logout successful");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong");
  }
};

//UPDATE PASSWORD CONTROLLER

const userChangePasswordController = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).send({
      status: false,
      message: "required all fields",
    });
  }

  if (oldPassword === newPassword) {
    return res.status(400).send({
      status: false,
      message: "old and new password are same",
    });
  }

  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [email], async (err, data) => {
    if (err) {
      return res.status(500).send({
        status: false,
        message: "Database error",
        error: err,
      });
    }

    if (data.length === 0) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    const oldPasswordExtracted = data[0].password;

    const matched = await bcrypt.compare(newPassword, oldPasswordExtracted);

    if (matched) {
      return res.status(400).send({
        status: false,
        message: "New password cannot be the same as the old password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(newPassword, salt);

    const updateQuery = "UPDATE users SET password = ? WHERE email = ?";

    db.query(updateQuery, [passwordHashed, email], (updateErr, updateData) => {
      if (updateErr) {
        return res.status(500).send({
          status: false,
          message: "Failed to update password",
          error: updateErr,
        });
      }

      return res.status(200).send({
        status: true,
        message: "Password updated successfully",
      });
    });
  });
};

//RESET PASSWORD USING

const resetPasswordController = async (req, res) => {
  const { email, question, password } = req.body;

  if (!email || !question || !password)
    return res
      .status(500)
      .send({ status: false, message: "required all fields" });

  const query_1 = "SELECT * FROM users WHERE id = ?";

  db.query(query_1, [req.userId], async (err, data) => {
    if (err)
      return res.status(500).send({
        status: false,
        message: "something went wrong sql error",
        error: err,
      });

    if (data.length === 0)
      return res.status(500).send({
        status: false,
        message: "user not found",
      });

    const user = data[0];

    if (user.question !== question)
      return res
        .status(500)
        .send({ status: false, message: "recover question not matched" });

    //HASHING THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";

    db.query(
      updateQuery,
      [passwordHashed, req.userId],
      (updateErr, updateData) => {
        if (updateErr)
          return res.status(500).send({
            status: false,
            message: "something went wrong sql error",
            error: updateErr,
          });

        return res.status(200).send({
          status: true,
          message: "password reset successfully",
        });
      }
    );
  });
};

//DELETE ACCOUNT CONTROLLER

const deleteAccountContoller = async (req, res) => {
  try {
    const { email, password, reEnteredPassword } = req.body;

    if (!email || !password || !reEnteredPassword) {
      return res.status(400).send("required all fields");
    }

    if (password !== reEnteredPassword)
      return res.status(400).send("old and new password does'nt matched");

    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [req.userId], (err, data) => {
      if (err)
        return res.status(400).send({
          status: false,
          message: err,
        });

      if (data.length === 0)
        return res
          .status(404)
          .send({ status: false, message: "user not found " });

      if (data.length > 0) {
        const q = "DELETE FROM users WHERE id = ?";
        db.query(q, [req.userId], (err, data) => {
          if (err)
            return res.status(400).send({
              status: false,
              message: err,
            });

          return res.status(200).send({
            status: true,
            message: "deleted successfully",
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: error,
      message: "something went wrong in the delete account controller",
    });
  }
};

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
  deleteAccountContoller,
  userChangePasswordController,
  resetPasswordController,
};
