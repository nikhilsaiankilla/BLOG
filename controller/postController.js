const { db } = require("./../config/db");
const moment = require("moment");
//FETCH ALL POSTS

const getAllPostsController = async (req, res) => {
  try {
    const q = req.query.category
      ? "SELECT * FROM posts WHERE category=?"
      : "SELECT * FROM posts";

    db.query(q, [req.query.category], (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "someting went wrong",
          error: err,
        });
      }

      if (data?.length === 0) {
        return res.status(404).send("no posts available");
      }

      return res.status(200).send(data);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong");
  }
};

//FETCH SINGLE POST

const getPostController = async (req, res) => {
  const q = "SELECT * FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).send({
        message: "something went wrong",
        error: err,
      });
    }

    if (data.length === 0) {
      return res.status(404).send({
        message: "no posts available",
      });
    }

    return res.status(200).send(data);
  });
};

//FETCH ALL POSTS OF THE ADMIN

const getAllPostsOfAdmin = (req, res) => {
  const query = "SELECT * FROM posts WHERE uid = ?";

  db.query(query, [req.params.id], (err, data) => {
    if (err)
      return res.status(500).send({
        status: false,
        message: "something went wrong in the sql",
        err: err,
      });

    if (data.length === 0)
      return res.status(404).send({
        status: false,
        message: "no posts available",
      });

    return res.status(200).send({
      status: true,
      message: "fetched successfully",
      data: data,
    });
  });
};

// DELETE POST

const deletePostController = async (req, res) => {
  try {
    const q = "DELETE FROM posts WHERE id = ?";

    db.query(q, [req.params.id], (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "something went wrong",
          error: err,
        });
      }

      return res.status(200).send({
        message: "post deleted",
        data: data,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong..!", error);
  }
};

// UPLOAD POST

const uploadPostController = async (req, res) => {
  //FIND USER

  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [req.userId], (userErr, userData) => {
    if (userErr)
      return res.status(500).send({
        message: "something went wrong",
        err: userErr,
      });

    const uploadQuery =
      "INSERT INTO posts (title, `desc`, uid, category, image, date) VALUES (?,?,?,?,?,?)";

    const { title, desc, category, image } = req.body;

    if (!title || !desc || !category || !image) {
      return res.status(400).send({
        message: "required all fields",
      });
    }

    const date = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    db.query(
      uploadQuery,
      [title, desc, req.userId, category, image, date],
      (err, data) => {
        if (err)
          return res.status(500).send({
            message: "something went wrong",
            err: err,
          });

        return res.status(200).send({
          message: "successfully uploaded",
          data: data,
        });
      }
    );
  });
};

//UPDATE POST

const updatePostController = async (req, res) => {
  try {
    const q = "SELECT * FROM users WHERE id = ?";

    db.query(q, [req.userId], (userErr, userData) => {
      if (userErr) {
        return res.status(500).send({
          message: "Something went wrong while fetching the user.",
          error: userErr,
        });
      }

      const { title, desc, category, image } = req.body;
      const { id } = req.params;

      const date = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

      const updates = [];
      const values = [];

      if (title) {
        updates.push("title = ?");
        values.push(title);
      }
      if (desc) {
        updates.push("`desc` = ?");
        values.push(desc);
      }
      if (category) {
        updates.push("category = ?");
        values.push(category);
      }
      if (image) {
        updates.push("image = ?");
        values.push(image);
      }

      if (updates.length === 0) {
        return res.status(400).send({
          message: "No fields to update.",
        });
      }

      values.push(date, id);
      const query = `UPDATE posts SET ${updates.join(
        ", "
      )}, date = ? WHERE id = ?`;

      db.query(query, values, (err, updateData) => {
        if (err) {
          return res.status(500).send({
            message: "Something went wrong while updating the post.",
            error: err,
          });
        }

        return res.status(200).send({
          message: "Updated successfully.",
        });
      });
    });
  } catch (err) {
    return res.status(500).send({
      message: "An unexpected error occurred.",
      error: err,
    });
  }
};

module.exports = {
  getAllPostsController,
  getPostController,
  updatePostController,
  uploadPostController,
  deletePostController,
  getAllPostsOfAdmin,
};
