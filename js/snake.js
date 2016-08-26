const Coord = require("./coord");

function Snake(board) {
  this.board = board;
  this.dir = "N";
  this.turning = false;
  this.growTurns = 0;

  const midIdx = Math.floor(board.dim / 2);
  const center = new Coord(midIdx, midIdx);
  this.segments = [center];
}

Snake.DIFFS = {
  "N": new Coord(-1, 0),
  "S": new Coord(1, 0),
  "E": new Coord(0, 1),
  "W": new Coord(0, -1)
}

Snake.GROW_TURNS = 3;

Snake.prototype.head = function () {
  const idx = this.segments.length - 1;
  return this.segments[idx];
};

Snake.prototype.turn = function (dir) {
  if (Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[dir]) || this.turning) {
    return;
  } else {
    this.turning = true;
    this.dir = dir;
  }
};

Snake.prototype.eatApple = function () {
  console.log(this.head());
  console.log(this.board.apple.position);
  return this.head().equals(this.board.apple.position);
};

Snake.prototype.isOccupying = function (array) {
  this.segments.forEach((segment)=>{
    if (segment.i === array[0] && segment.j === array[0]) {
      return true;
    }
  })
  return false;
};

Snake.prototype.isValid = function () {
  const head = this.head();

  if (!this.board.validPosition(head)) {
    return false;
  }

  for (let i = 0; i < this.segments.length - 1; i++) {
    if (this.segments[i].equals(head)) {
      return false;
    }
  }
  return true;
};

Snake.prototype.move = function () {
  this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));
  this.turning = false;

  if (this.eatApple()) {
    this.growTurns += Snake.GROW_TURNS;
    this.board.apple.replace();
  }

  if (this.growTurns > 0) {
    this.growTurns -= 1;
  } else {
    this.segments.shift();
  }

  if (!this.isValid()) {
    this.segments = [];
  }
};

module.exports = Snake;
