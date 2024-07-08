const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();

const events = require("events");
events.EventEmitter.defaultMaxListeners = 20;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

console.log(process.env.DB_PORT);

app.use("/v1/api/auth", require("./routes/authRoute"));

app.use("/v1/api/users", require("./routes/userRoute"));

app.use("/v1/api/posts", require("./routes/postRoute"));

app.listen(process.env.PORT || 8888, () => {
  console.log(`server started at port ${process.env.PORT || 8888}`);
});
