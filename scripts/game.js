const keyMap = {
  ArrowRight: "RIGHT",
  ArrowLeft: "LEFT",
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  Space: "SPACE",
  KeyD: "D",
};
const canvas = document.getElementById("canvas");
let world;
const keyboard = new Keyboard();
let gameStarted = false;
let gameActive = false;
let endScreenTimeout = null;
let isMuted = false;
const backgroundMusic = new Audio("./audio/background_music/La_Cucaracha.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.03;
const startButton = document.getElementById("startButton");
const instructionsButton = document.getElementById("instructionsButton");
const backButton = document.getElementById("backButton");
const restartButton = document.getElementById("restartButton");
const returnButton = document.getElementById("returnButton");
const muteButton = document.getElementById("muteButton");

/**
 * Initializes the game, sets up event listeners and checks orientation.
 */
const init = () => {
  loadMutedState();
  addEventListenerToButtons();
  setupMobileControls();
  checkOrientation();
  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
};

/**
 * Loads the muted state from localStorage and applies it.
 */
const loadMutedState = () => {
  const savedMutedState = localStorage.getItem("isMuted");
  if (savedMutedState !== null) {
    isMuted = savedMutedState === "true";
    backgroundMusic.muted = isMuted;
    if (isMuted) {
      muteButton.style.opacity = "0.5";
    }
  }
};

/**
 * Adds click event listeners to all menu and control buttons.
 */
const addEventListenerToButtons = () => {
  startButton.addEventListener("click", startGame);
  instructionsButton.addEventListener("click", showInstructions);
  backButton.addEventListener("click", showMainMenu);
  restartButton.addEventListener("click", restartGame);
  returnButton.addEventListener("click", returnToMenu);
  muteButton.addEventListener("click", toggleMute);
};

/**
 * Checks device orientation and shows warning on mobile portrait mode.
 */
const checkOrientation = () => {
  const orientationWarning = document.getElementById("orientationWarning");
  const isMobile = window.innerWidth <= 720;
  const isTabletSize = window.innerWidth >= 720 && window.innerWidth <= 1366;
  const hasTouch = navigator.maxTouchPoints > 0;
  const isPortrait = window.innerHeight > window.innerWidth;

  if ((isMobile || (isTabletSize && hasTouch)) && isPortrait) {
    orientationWarning.classList.remove("hidden");
  } else {
    orientationWarning.classList.add("hidden");
  }
};

/**
 * Sets up touch event listeners for mobile control buttons.
 */
const setupMobileControls = () => {
  setupTouchControl("btnLeft", "LEFT");
  setupTouchControl("btnRight", "RIGHT");
  setupTouchControl("btnJump", "SPACE");
  setupTouchControl("btnThrow", "D");
};

/**
 * Attaches touch event listeners to a control button.
 * @param {string} buttonId - ID of the button element.
 * @param {string} keyboardKey - Corresponding keyboard property.
 */
const setupTouchControl = (buttonId, keyboardKey) => {
  const button = document.getElementById(buttonId);
  if (!button) return;
  addTouchStartListener(button, keyboardKey);
  addTouchEndListener(button, keyboardKey);
  addTouchCancelListener(button, keyboardKey);
};

/**
 * Adds touchstart event listener to activate keyboard key.
 * @param {HTMLElement} button - Button element.
 * @param {string} keyboardKey - Keyboard property to set.
 */
const addTouchStartListener = (button, keyboardKey) => {
  button.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      keyboard[keyboardKey] = true;
      button.classList.add("pressed");
    },
    { passive: false }
  );
};

/**
 * Adds touchend event listener to deactivate keyboard key.
 * @param {HTMLElement} button - Button element.
 * @param {string} keyboardKey - Keyboard property to unset.
 */
const addTouchEndListener = (button, keyboardKey) => {
  button.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      keyboard[keyboardKey] = false;
      button.classList.remove("pressed");
    },
    { passive: false }
  );
};

/**
 * Adds touchcancel event listener to deactivate keyboard key.
 * @param {HTMLElement} button - Button element.
 * @param {string} keyboardKey - Keyboard property to unset.
 */
const addTouchCancelListener = (button, keyboardKey) => {
  button.addEventListener("touchcancel", () => {
    keyboard[keyboardKey] = false;
    button.classList.remove("pressed");
  });
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
 * Resets all keyboard input states to false.
 */
const resetKeyboard = () => {
  keyboard.RIGHT = false;
  keyboard.LEFT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
};

/**
 * Starts a new game instance.
 */
const startGame = () => {
  if (gameActive) return;
  cleanupWorld();
  resetKeyboard();
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
  resetKeyboard();
  cleanupWorld();
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
  resetKeyboard();
  cleanupWorld();
  document.getElementById("endingScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
  showMainMenu();
};

/**
 * Cleans up the world instance and releases resources.
 */
const cleanupWorld = () => {
  if (world) {
    world.cleanup();
    world = null;
  }
};

/**
 * Displays the ending screen with win/lose message.
 * @param {boolean} won - True if player won, false if lost.
 */
const showEndingScreen = (won) => {
  gameActive = false;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  cleanupWorld();
  const endingImage = document.getElementById("endingImage");
  setEndscreenImage(won, endingImage);
  endScreenTimeout = setTimeout(() => {
    if (!gameActive) {
      document.getElementById("canvasContainer").classList.add("hidden");
      document.getElementById("endingScreen").classList.remove("hidden");
    }
  }, 1000);
};

/**
 * Sets the appropriate ending image based on win/lose state.
 * @param {boolean} won - True if player won, false if lost.
 * @param {HTMLImageElement} endingImage - The image element to update.
 */
const setEndscreenImage = (won, endingImage) => {
  if (won) {
    endingImage.src = "./img/You won, you lost/You won A.png";
    endingImage.alt = "You Won!";
  } else {
    endingImage.src = "./img/You won, you lost/Game over A.png";
    endingImage.alt = "Game Over";
  }
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

/**
 * Handles keyboard key press events.
 * @param {KeyboardEvent} e - Keyboard event.
 */
const handleKeyDown = (e) => {
  if (!gameStarted) return;
  const key = keyMap[e.code];
  if (key) keyboard[key] = true;
};

/**
 * Handles keyboard key release events.
 * @param {KeyboardEvent} e - Keyboard event.
 */
const handleKeyUp = (e) => {
  if (!gameStarted) return;
  const key = keyMap[e.code];
  if (key) keyboard[key] = false;
};

init();
