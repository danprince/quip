let test = require("tape");
let server = require("./server");
let io = require("socket.io-client");

test("server", t => {
  server.listen(3000);

  let client = io(`http://localhost:3000`);

  client.emit("room.setup");

  client.on("room.init", event => {
    t.pass("should emit a 'room' event after connecting");
    done();
  });

  function done() {
    client.disconnect();
    server.close();
    t.end();
  }
});
