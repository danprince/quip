class Timer {
  constructor(callback, ms) {
    this.duration = ms;
    this.remaining = this.duration;
    this.callback = callback;
    this.started = Date.now();
    this.timeout = setTimeout(this.callback, this.remaining);
  }

  cancel() {
    clearTimeout(this.timeout);
  }

  pause() {
    let elapsed = Date.now() - this.started;
    this.remaining -= elapsed;
    this.cancel();
  }

  resume() {
    this.started = Date.now();
    this.timeout = setTimeout(this.callback, this.remaining);
  }

  skip() {
    this.cancel();
    this.callback();
  }
}

module.exports = Timer;
