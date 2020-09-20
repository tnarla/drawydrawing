var app = require("express")();
var http = require("http").createServer(app);
var cors = require("cors");
var io = require("socket.io")(http);
const getPort = require("get-port");

app.use(cors({ credentials: true }));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 6000;
}

http.listen(port, () => {
  console.log(`listening on ${port}`);
});

io.on("connection", (socket) => {
  let roomID = "default";
  console.log("a user connected");
  socket.on("room", function (room) {
    socket.join(room);
    roomID = room;
  });

  socket.on("sendImageData", (data) => {
    io.sockets.in(roomID).emit("update", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
