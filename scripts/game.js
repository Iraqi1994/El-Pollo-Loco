let canvas;
let world;

const init = () => {
  canvas = document.getElementById("canvas");
  world = new World(canvas);

  console.log("my char is ", world.character);
};
