let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameActive = false;

const init = () => {
  canvas = document.getElementById("canvas");
  const startButton = document.getElementById("startButton");
  const instructionsButton = document.getElementById("instructionsButton");
  const backButton = document.getElementById("backButton");
  const restartButton = document.getElementById("restartButton");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const exitFullscreenButton = document.getElementById("exitFullscreenButton");

  startButton.addEventListener("click", startGame);
  instructionsButton.addEventListener("click", showInstructions);
  backButton.addEventListener("click", showMainMenu);
  restartButton.addEventListener("click", restartGame);
  fullscreenButton.addEventListener("click", enterFullscreen);
  exitFullscreenButton.addEventListener("click", exitFullscreen);

  document.addEventListener("fullscreenchange", handleFullscreenChange);
};

const showInstructions = () => {
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("instructionsView").classList.remove("hidden");
};

const showMainMenu = () => {
  document.getElementById("mainMenu").classList.remove("hidden");
  document.getElementById("instructionsView").classList.add("hidden");
};

const startGame = () => {
  if (gameStarted) return;

  gameStarted = true;
  gameActive = true;

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("canvasContainer").classList.remove("hidden");
  world = new World(canvas, keyboard);
};

const restartGame = () => {
  gameStarted = false;
  gameActive = false;
  world = null;

  document.getElementById("endingScreen").classList.add("hidden");
  document.getElementById("canvasContainer").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
  showMainMenu();
};

const showEndingScreen = (won) => {
  gameActive = false;

  const endingImage = document.getElementById("endingImage");
  if (won) {
    endingImage.src = "./img/You won, you lost/You won A.png";
    endingImage.alt = "You Won!";
  } else {
    endingImage.src = "./img/You won, you lost/Game over A.png";
    endingImage.alt = "Game Over";
  }

  setTimeout(() => {
    document.getElementById("canvasContainer").classList.add("hidden");
    document.getElementById("endingScreen").classList.remove("hidden");
  }, 1000);
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
    fullscreenButton.classList.add("hidden");
    exitFullscreenButton.classList.remove("hidden");
  } else {
    fullscreenButton.classList.remove("hidden");
    exitFullscreenButton.classList.add("hidden");
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
