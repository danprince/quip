let EventEmitter = require("events");

class Timer extends EventEmitter {
  constructor(callback, ms) {
    super();
    this.duration = ms;
    this.callback = callback;
    this.timeout = undefined;
  }

  start() {
    this.started = Date.now();
    this.timeout = setTimeout(() => this.done(), this.duration);
    this.emit("start");
  }

  skip() {
    clearTimeout(this.timeout);
    this.emit("skip");
    this.done();
  }

  done() {
    this.emit("stop");
    this.callback();
  }
}

module.exports = Timer;
