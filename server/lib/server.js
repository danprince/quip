let Server = require("socket.io");
let log = require("winston");
let Room = require("./Room");
let middleware = require("./middleware");

let server = new Server();
let rooms = {};

server.use(middleware.errorHandling);

server.on("connection", socket => {
  socket.on("room.setup", () => {
    let room = new Room(server, socket);
    rooms[room.id] = room;
    socket.emit("room.init", { id: room.id });
  });
});

server.on("error", error => {
  log.error(error.message || error);
});

server.rooms = rooms;

module.exports = server;
