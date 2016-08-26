const Board = require('./board.js');

const View = function ($el){
  this.$el = $el;

  this.board = new Board(20);
  this.setupGrid();

  this.intervalId = window.setInterval(
    this.step.bind(this),
    View.STEP_MILLIS
  );

  $(window).on("keydown", this.handleKeyEvent.bind(this));
}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W"
};

View.STEP_MILLIS = 100;

View.prototype.handleKeyEvent = function (event) {
  const dir = View.KEYS[event.keyCode]
  if (dir) {
    this.board.snake.turn(dir);
  }
};

View.prototype.render = function () {
  this.updateClasses([this.board.apple.position], "apple");
  this.updateClasses(this.board.snake.segments, "snake");
};

View.prototype.updateClasses = function (coords, className) {
  this.$li.filter("." + className).removeClass();

  coords.forEach( coord => {
    const flatCoord = (coord.i * this.board.dim) + coord.j;
    this.$li.eq(flatCoord).addClass(className);
  })
};

View.prototype.setupGrid = function () {
  let html = "";

  for (let i = 0; i < this.board.dim; i++) {
    html += "<ul>";
    for (let j = 0; j < this.board.dim; j++) {
      html += "<li></li>";
    }
    html += "</ul>";
  }

  this.$el.html(html);
  this.$li = this.$el.find("li");
};

View.prototype.step = function () {
  if (this.board.snake.segments.length > 0) {
    this.board.snake.move();
    this.render();
  } else {
    alert("You lose!");
    window.clearInterval(this.intervalId);
  }
};

module.exports = View;
