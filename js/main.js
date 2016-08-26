const SnakeView = require('./snake_view');

$(()=>{
  const rootEl = $(".snake-game");
  new SnakeView(rootEl);
})
