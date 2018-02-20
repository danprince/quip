let { shuffle } = require("lodash");

let packs = {
  default: require("../data/prompts.json"),
  adult: require("../data/prompts_adult.json"),
  alt: require("../data/prompts_alt.json")
};

class Deck {
  static from(names) {
    let cards = [];

    for (let name of names) {
      let pack = packs[name];

      if (pack === undefined) {
        throw new Error(`No such pack as '${name}'!`);
      }

      cards.push(...pack);
    }

    return new Deck(cards);
  }

  get length() {
    return this.cards.length;
  }

  constructor(cards) {
    this.cards = cards;
    this.cursor = 0;
  }

  shuffle() {
    this.cards = shuffle(this.cards);
    return this;
  }

  next() {
    let card = this.cards[this.cursor % this.length];
    this.cursor += 1;
    return card;
  }

  take(n) {
    let cards = [];

    for (let i = 0; i < n; i++) {
      cards.push(this.next());
    }

    return cards;
  }
}

module.exports = Deck;
