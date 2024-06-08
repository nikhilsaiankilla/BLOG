const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/v1/api/auth", require("./routes/authRoute"));

app.use("/v1/api/users", require("./routes/userRoute"));

app.use("/v1/api/posts", require("./routes/postRoute"));

app.listen(8000, () => {
  console.log("server started at port 8000");
});
