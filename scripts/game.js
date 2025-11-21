let canvas;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let gameActive = false;
let endScreenTimeout = null;
let isMuted = false;
let backgroundMusic = new Audio("audio/background_music/La_Cucaracha.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.03;

const init = () => {
  canvas = document.getElementById("canvas");
  const startButton = document.getElementById("startButton");
  const instructionsButton = document.getElementById("instructionsButton");
  const backButton = document.getElementById("backButton");
  const restartButton = document.getElementById("restartButton");
  const returnButton = document.getElementById("returnButton");
  const muteButton = document.getElementById("muteButton");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const exitFullscreenButton = document.getElementById("exitFullscreenButton");
  const savedMutedState = localStorage.getItem("isMuted");
  if (savedMutedState !== null) {
    isMuted = savedMutedState === "true";
    backgroundMusic.muted = isMuted;
    if (isMuted) {
      muteButton.style.opacity = "0.5";
    }
  }

  startButton.addEventListener("click", startGame);
  instructionsButton.addEventListener("click", showInstructions);
  backButton.addEventListener("click", showMainMenu);
  restartButton.addEventListener("click", restartGame);
  returnButton.addEventListener("click", returnToMenu);
  muteButton.addEventListener("click", toggleMute);
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
  if (gameActive) return;

  if (world) {
    world.cleanup();
    world = null;
  }

  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;

  gameStarted = true;
  gameActive = true;

  backgroundMusic.play();
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("canvasContainer").classList.remove("hidden");
  world = new World(canvas, keyboard);
};

const restartGame = () => {
  gameActive = false;

  if (endScreenTimeout) {
    clearTimeout(endScreenTimeout);
    endScreenTimeout = null;
  }

  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;

  if (world) {
    world.cleanup();
    world = null;
  }

  document.getElementById("endingScreen").classList.add("hidden");
  document.getElementById("canvasContainer").classList.remove("hidden");

  gameStarted = true;
  gameActive = true;
  backgroundMusic.play();
  world = new World(canvas, keyboard);
};

const returnToMenu = () => {
  gameActive = false;
  gameStarted = false;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  if (endScreenTimeout) {
    clearTimeout(endScreenTimeout);
    endScreenTimeout = null;
  }

  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;

  if (world) {
    world.cleanup();
    world = null;
  }

  document.getElementById("endingScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
  showMainMenu();
};
const showEndingScreen = (won) => {
  gameActive = false;

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  const endingImage = document.getElementById("endingImage");
  if (won) {
    endingImage.src = "./img/You won, you lost/You won A.png";
    endingImage.alt = "You Won!";
  } else {
    endingImage.src = "./img/You won, you lost/Game over A.png";
    endingImage.alt = "Game Over";
  }

  endScreenTimeout = setTimeout(() => {
    if (!gameActive) {
      document.getElementById("canvasContainer").classList.add("hidden");
      document.getElementById("endingScreen").classList.remove("hidden");
    }
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

const toggleMute = () => {
  isMuted = !isMuted;
  backgroundMusic.muted = isMuted;
  localStorage.setItem("isMuted", isMuted);

  const muteButton = document.getElementById("muteButton");
  if (isMuted) {
    muteButton.style.opacity = "0.5";
  } else {
    muteButton.style.opacity = "1";
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
