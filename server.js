const port = 3000;

// start socket server at specified port
const io = require("socket.io")(port);

// store current users in a session
const users = [];

// when connection is made
io.on("connection", (socket) => {
  // when a new user joins
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    // send the message to all the other clients except the newly created connection
    socket.broadcast.emit("user-connected", name);
  });

  // when a user sends a message
  socket.on("send-chat-message", (message) => {
    // send the message to all clients
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  // when a user disconnects
  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});
