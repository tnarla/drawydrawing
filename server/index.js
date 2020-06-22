var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

http.listen(5000, () => {
  console.log("listening on *:5000");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.emit("update");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
