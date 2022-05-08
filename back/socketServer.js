const mongoose = require("mongoose");
const server = require("http").createServer();
const { Server } = require("socket.io");
const sioAPI = require("./sioAPI");
const onAuth = require("./sioAPI/auth/onAuth");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3003",
    credentials: true,
  },
});

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(3001, () => console.log("socket listening"));
  })
  .catch(console.log);

io.on("connection", socket => {
  const API = sioAPI.provide({ socket, io });
  const withAuth = onAuth(io);

  try {
    socket.on("join_room", API.roomLeader);

    socket.on("send_data", withAuth(API.sioGeneralAuthDBInteractionsExecutor));

    socket.on("leave_room", API.roomLeader);

    socket.on("new_contact", data => {
      socket.broadcast.emit("new_contact", data);
    });

    socket.on("broadcast_data", API.onBroadcastingData);

    socket.on("disconnect", () => console.log("disconnected"));
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
});
