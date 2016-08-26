/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const SnakeView = __webpack_require__(1);
	
	$(()=>{
	  const rootEl = $(".snake-game");
	  new SnakeView(rootEl);
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(3);
	const Apple = __webpack_require__(5);
	
	function Board(dim){
	  this.dim = dim;
	  this.snake = new Snake(this);
	  this.apple = new Apple(this);
	}
	
	Board.prototype.validPosition = function (coord) {
	  return (0 <= coord.i && coord.i < this.dim) && (0 <= coord.j && coord.j < this.dim);
	};
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(4);
	
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Coord (i, j) {
	  this.i = i;
	  this.j = j;
	}
	
	Coord.prototype.plus = function (coord2) {
	  return new Coord(this.i + coord2.i, this.j + coord2.j);
	};
	
	Coord.prototype.equals = function (coord2) {
	  return (this.i === coord2.i) && (this.j === coord2.j);
	};
	
	Coord.prototype.isOpposite = function (coord2) {
	  return (this.i === -1 * coord2.i) && (this.j === -1 * coord2.j);
	};
	
	module.exports = Coord;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(4);
	
	function Apple (board) {
	  this.board = board;
	  this.replace();
	}
	
	Apple.prototype.replace = function () {
	  let x = Math.floor(Math.random() * this.board.dim);
	  let y = Math.floor(Math.random() * this.board.dim);
	
	  while (this.board.snake.isOccupying([x, y])) {
	    x = Math.floor(Math.random() * this.board.dim);
	    y = Math.floor(Math.random() * this.board.dim);
	  }
	
	  this.position = new Coord(x, y);
	};
	
	module.exports = Apple;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map