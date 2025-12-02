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

/**
 * Initializes the game, sets up event listeners and checks orientation.
 */
const init = () => {
  canvas = document.getElementById("canvas");
  const startButton = document.getElementById("startButton");
  const instructionsButton = document.getElementById("instructionsButton");
  const backButton = document.getElementById("backButton");
  const restartButton = document.getElementById("restartButton");
  const returnButton = document.getElementById("returnButton");
  const muteButton = document.getElementById("muteButton");
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

  setupMobileControls();
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
};

/**
 * Checks device orientation and shows warning on mobile portrait mode.
 */
const checkOrientation = () => {
  const orientationWarning = document.getElementById("orientationWarning");
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 720;
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isMobile && isPortrait) {
    orientationWarning.classList.remove("hidden");
  } else {
    orientationWarning.classList.add("hidden");
  }
};

/**
 * Sets up touch event listeners for mobile control buttons.
 */
const setupMobileControls = () => {
  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");
  const btnJump = document.getElementById("btnJump");
  const btnThrow = document.getElementById("btnThrow");

  if (btnLeft) {
    btnLeft.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keyboard.LEFT = true;
        btnLeft.classList.add("pressed");
      },
      { passive: false }
    );
    btnLeft.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keyboard.LEFT = false;
        btnLeft.classList.remove("pressed");
      },
      { passive: false }
    );
    btnLeft.addEventListener("touchcancel", (e) => {
      keyboard.LEFT = false;
      btnLeft.classList.remove("pressed");
    });
  }

  if (btnRight) {
    btnRight.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keyboard.RIGHT = true;
        btnRight.classList.add("pressed");
      },
      { passive: false }
    );
    btnRight.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keyboard.RIGHT = false;
        btnRight.classList.remove("pressed");
      },
      { passive: false }
    );
    btnRight.addEventListener("touchcancel", (e) => {
      keyboard.RIGHT = false;
      btnRight.classList.remove("pressed");
    });
  }

  if (btnJump) {
    btnJump.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keyboard.SPACE = true;
        btnJump.classList.add("pressed");
      },
      { passive: false }
    );
    btnJump.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keyboard.SPACE = false;
        btnJump.classList.remove("pressed");
      },
      { passive: false }
    );
    btnJump.addEventListener("touchcancel", (e) => {
      keyboard.SPACE = false;
      btnJump.classList.remove("pressed");
    });
  }

  if (btnThrow) {
    btnThrow.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        keyboard.D = true;
        btnThrow.classList.add("pressed");
      },
      { passive: false }
    );
    btnThrow.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        keyboard.D = false;
        btnThrow.classList.remove("pressed");
      },
      { passive: false }
    );
    btnThrow.addEventListener("touchcancel", (e) => {
      keyboard.D = false;
      btnThrow.classList.remove("pressed");
    });
  }
};

/**
 * Displays the instructions screen.
 */
const showInstructions = () => {
  document.getElementById("mainMenu").classList.add("hidden");
  document.getElementById("instructionsView").classList.remove("hidden");
};

/**
 * Shows the main menu screen.
 */
const showMainMenu = () => {
  document.getElementById("mainMenu").classList.remove("hidden");
  document.getElementById("instructionsView").classList.add("hidden");
};

/**
 * Starts a new game instance.
 */
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

/**
 * Restarts the game after game over.
 */
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

/**
 * Returns to main menu from game over screen.
 */
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
/**
 * Displays the ending screen with win/lose message.
 * @param {boolean} won - True if player won, false if lost.
 */
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

/**
 * Toggles audio mute state and saves to localStorage.
 */
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
