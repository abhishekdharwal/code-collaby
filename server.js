const express = require("express");
const { Server } = require("socket.io");
const app = express();
const path = require("path");
const http = require("http");
const ACTIONS = require("./src/Actions");
// const { log } = require("console");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("build"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// this is the map of socket of user to username ;
const usernameMap = {};
// this function return user connected to a particular room;
function getAllConnectedUser(roomId) {
  // the roomId will contain the list of socket.id of users we map these sockets ids back to clients
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return { socketId, username: usernameMap[socketId] };
    }
  );
}
io.on("connection", (socket) => {
  // console.log("socket connected", socket.id);
  // this is when a particular user join the room
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    // here we map the username to socket.id in usernameMap
    usernameMap[socket.id] = username;
    // here we connect or add that user to room
    socket.join(roomId);
    // here we call all the list of connected clients
    const clients = getAllConnectedUser(roomId);
    // console.log(clients);

    clients.forEach(({ socketId }) => {
      // io.to is used for emit to individual socket id private message
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });
  // this we are doing for a particular soketId only
  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // console.log("working");
    // console.log(rooms);
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: usernameMap[socket.id],
      });
    });
    delete usernameMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
