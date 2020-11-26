var app = require("express")();
var http = require("http").createServer(app);
var cors = require("cors");
var io = require("socket.io")(http);
const getPort = require("get-port");

app.use(cors({ credentials: true }));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

http.listen(port, () => {
  console.log(`listening on ${port}`);
});

const rooms = new Map();

io.on("connection", (socket) => {
  let roomID;

  function joinRoom(room) {
    socket.join(room);
    roomID = room;
    socket.emit("joined", room);
  }

  socket.on("join", function (room, password) {
    // You're already in this room:
    if (room === roomID) {
      return;
    }

    if (rooms.get(room) === password) {
      joinRoom(room);
    } else {
      if (rooms.get(room) && !password) {
        socket.emit("requestPassword");
      }
      socket.emit(
        "joinFailed",
        password ? "The password is incorrect" : "This room requires a password"
      );
    }
  });

  socket.on("create", function (room, password) {
    if (rooms.has(room)) {
      socket.emit("createFailed", "A room with that code already exists.");
    } else {
      rooms.set(room, password);
      joinRoom(room);
    }
  });

  socket.on("sendImageData", (data) => {
    if (!roomID) {
      // If the user has not yet joined a room, then this is a no-op.
      return;
    }

    io.sockets.in(roomID).emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
