let log = require("winston");

function errorHandling(socket, next) {
  let on = socket.on.bind(socket);

  socket.on = (event, callback) => {
    on(event, (...args) => {
      try {
        callback(...args);
      } catch (err) {
        log.warn(err.message || err);
        socket.emit("err", err);
      }
    });
  };

  next();
}

module.exports = {
  errorHandling
};
