var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port);

http.listen(port, () => {
  console.log(`listening on ${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendImageData", (data) => {
    socket.broadcast.emit('update', data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
