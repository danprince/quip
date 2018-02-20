let test = require("tape");
let io = require("socket.io-client");
let server = require("../lib/server");
let wait = setTimeout;

//test("1. basic game", t => {
//  server.listen(3000);
//
//  let host = io(`http://localhost:3000`);
//  let clients = {};
//  let room = null;
//
//  host.emit("setup");
//
//  host.on("room", event => {
//    let client = () => io(
//      `http://localhost:3000/${event.id}`,
//      { reconnection: false }
//    );
//
//    room = server.rooms[event.id];
//    clients.dan = client();
//    clients.ed = client();
//    clients.pete = client();
//
//    wait(rename, 100);
//  });
//
//  function rename() {
//    t.ok(room, "should have created a room");
//    t.is(room.clients.length, 3, "should have connection for each client");
//
//    clients.dan.emit("rename", "Dan");
//    clients.ed.emit("rename", "Ed");
//    clients.pete.emit("rename", "Pete");
//
//    wait(start, 100);
//  }
//
//  function start() {
//    host.once("next", ({ round, prompts }) => {
//      t.is(round, 1, "should have started round 1");
//      wait(voting, 100);
//    });
//
//    clients.dan.once("next", ({ round, prompts }) => {
//      clients.dan.emit("answer", { prompt: prompts[0].id, text: "dantime" });
//    });
//
//    clients.ed.once("next", ({ round, prompts }) => {
//      clients.ed.emit("answer", { prompt: prompts[0].id, text: "edstuff" });
//    });
//
//    clients.pete.once("next", ({ round, prompts }) => {
//      clients.pete.emit("answer", { prompt: prompts[0].id, text: "peteor" });
//    });
//
//    host.emit("start");
//  }
//
//  function voting() {
//    wait(done, 100);
//  }
//
//  function done() {
//    host.disconnect();
//    room.close();
//    server.close();
//    t.end();
//  }
//});
