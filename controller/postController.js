const { db } = require("./../config/db");

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
      return res.status(500).send({
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

const uploadPostController = async (req, res) => {};

//UPDATE POST

const updatePostController = async (req, res) => {};

module.exports = {
  getAllPostsController,
  getPostController,
  updatePostController,
  uploadPostController,
  deletePostController,
  getAllPostsOfAdmin,
};
