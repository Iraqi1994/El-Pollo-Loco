let canvas;
let world;

const init = () => {
  canvas = document.getElementById("canvas");
  world = new World(canvas);
};
