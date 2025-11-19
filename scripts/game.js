let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameActive = false;

const init = () => {
  canvas = document.getElementById("canvas");
  const startButton = document.getElementById("startButton");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const exitFullscreenButton = document.getElementById("exitFullscreenButton");

  startButton.addEventListener("click", startGame);
  fullscreenButton.addEventListener("click", enterFullscreen);
  exitFullscreenButton.addEventListener("click", exitFullscreen);

  document.addEventListener("fullscreenchange", handleFullscreenChange);
};

const startGame = () => {
  if (gameStarted) return;

  gameStarted = true;
  gameActive = true;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("canvasContainer").style.display = "block";
  world = new World(canvas, keyboard);
};

const enterFullscreen = () => {
  const container = document.getElementById("canvasContainer");
  if (container.requestFullscreen) {
    container.requestFullscreen();
  } else if (container.webkitRequestFullscreen) {
    container.webkitRequestFullscreen();
  } else if (container.msRequestFullscreen) {
    container.msRequestFullscreen();
  }
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

const handleFullscreenChange = () => {
  const fullscreenButton = document.getElementById("fullscreenButton");
  const exitFullscreenButton = document.getElementById("exitFullscreenButton");

  if (document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    fullscreenButton.style.display = "none";
    exitFullscreenButton.style.display = "block";
  } else {
    fullscreenButton.style.display = "block";
    exitFullscreenButton.style.display = "none";
  }
};
window.addEventListener("load", init);
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;

  if (e.code == "ArrowRight") {
    keyboard.RIGHT = true;
  }
  if (e.code == "ArrowLeft") {
    keyboard.LEFT = true;
  }
  if (e.code == "ArrowUp") {
    keyboard.UP = true;
  }
  if (e.code == "ArrowDown") {
    keyboard.DOWN = true;
  }
  if (e.code == "Space") {
    keyboard.SPACE = true;
  }
  if (e.code == "KeyD") {
    keyboard.D = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (!gameStarted) return;

  if (e.code == "ArrowRight") {
    keyboard.RIGHT = false;
  }
  if (e.code == "ArrowLeft") {
    keyboard.LEFT = false;
  }
  if (e.code == "ArrowUp") {
    keyboard.UP = false;
  }
  if (e.code == "ArrowDown") {
    keyboard.DOWN = false;
  }
  if (e.code == "Space") {
    keyboard.SPACE = false;
  }
  if (e.code == "KeyD") {
    keyboard.D = false;
  }
});
