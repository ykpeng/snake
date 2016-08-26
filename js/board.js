const Snake = require('./snake');
const Apple = require('./apple');

function Board(dim){
  this.dim = dim;
  this.snake = new Snake(this);
  this.apple = new Apple(this);
}

Board.prototype.validPosition = function (coord) {
  return (0 <= coord.i && coord.i < this.dim) && (0 <= coord.j && coord.j < this.dim);
};

module.exports = Board;
