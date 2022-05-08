const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");

const { authorization, renewAccess } = require("./controllers/auth");
const chatControls = require("./controllers/chat");

const accountRoute = require("./routes/account.js");
const chatRoute = require("./routes/chat.js");
const invitRoute = require("./routes/invit.js");

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
    // useFind
  })
  .then(() => {
    app.listen(3000, console.log("listenig"));
  })
  .catch(console.log);

const conn = mongoose.connection;
let gfs, db;

conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  db = conn.db;
});

const midProvider = (req, res, next) => {
  req.gfs = gfs;
  req.db = db;
  next();
};

app.use(midProvider);

app.use("/account", accountRoute);
app.use("/chat", chatRoute);
app.use("/invit", invitRoute);
