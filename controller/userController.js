const { db } = require("./../config/db");
//GET USER DETAILS

const getUserController = (req, res) => {
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [req.params.id], (err, data) => {
    if (err)
      return res.status(500).send({
        status: false,
        message: "something went wrong in the sql",
        err: err,
      });

    if (data.length === 0)
      return res.status(404).send({ status: false, message: "user not found" });

    const user = data[0];

    user.password = undefined;

    const currentUser = {
      ...user,
    };

    return res.status(200).send({
      status: true,
      data: currentUser,
    });
  });
};
module.exports = { getUserController };
