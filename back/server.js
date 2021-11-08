const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");

const userRoute = require("./routes/user.js");
const chatRoute = require("./routes/chat.js");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, console.log("listenig"));
  })
  .catch(console.log);

app.get("/", (req, res) => {
  res.json("hello");
});

app.use("/user", userRoute);
app.use("/chat", chatRoute);
