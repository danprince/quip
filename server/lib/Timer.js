let EventEmitter = require("events");
let utils = require("./utils");

class Timer extends EventEmitter {
  constructor(callback, ms) {
    super();
    this.id = utils.id("timer");
    this.duration = ms;
    this.callback = callback;
    this.timeout = undefined;
  }

  start() {
    this.started = Date.now();
    this.timeout = setTimeout(() => this.stop(), this.duration);
    this.emit("start");
  }

  skip() {
    clearTimeout(this.timeout);
    this.emit("skip");
    this.done();
  }

  stop() {
    this.emit("stop");
    this.callback();
  }

  toJSON() {
    return {
      id: this.id,
      duration: this.duration
    }
  }
}

module.exports = Timer;
