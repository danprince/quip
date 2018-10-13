let EventEmitter = require("events");
let utils = require("./utils");

class Timer extends EventEmitter {
  constructor(callback, ms) {
    super();
    this.id = utils.id("timer");
    this.duration = ms;
    this.ending = Date.now() + this.duration;
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
    this.stop();
  }

  stop() {
    this.emit("stop");
    this.callback();
    this.removeAllListeners();
  }

  toJSON() {
    return {
      id: this.id,
      duration: this.duration,
      ending: this.ending
    }
  }
}

module.exports = Timer;
