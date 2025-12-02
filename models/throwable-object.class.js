class ThrowableObject extends MovableObject {
  speedX = 15;
  isSplashing = false;
  splashStartTime = 0;
  throwInterval;
  splashInterval;

  IMAGES_THROWING = [
    "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a throwable bottle.
   * @param {number} x - Starting x position.
   * @param {number} y - Starting y position.
   * @param {boolean} throwLeft - Direction to throw.
   */
  constructor(x, y, throwLeft = false) {
    super().loadImage("./img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_THROWING);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.offset = { top: 18, right: 15, bottom: 7, left: 25 };
    if (throwLeft) {
      this.speedX = -15;
      this.otherDirection = true;
    }
  }

  /**
   * Throws the bottle with arc physics.
   */
  throw() {
    this.speedY = 20;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (this.isActive && !this.isSplashing) {
        this.x += this.speedX;
        this.playAnimation(this.IMAGES_THROWING);
      }
    }, 25);
    this.intervals.push(this.throwInterval);
  }

  /**
   * Triggers bottle splash animation.
   */
  splash() {
    if (this.isSplashing) return;
    this.initializeSplash();
    this.startSplashAnimation();
  }

  /**
   * Sets up splash state.
   */
  initializeSplash() {
    this.isSplashing = true;
    this.splashStartTime = Date.now();
    this.speedX = 0;
    this.speedY = 0;
    clearInterval(this.throwInterval);
  }

  /**
   * Plays splash animation frames.
   */
  startSplashAnimation() {
    let splashFrame = 0;
    this.splashInterval = setInterval(() => {
      if (!this.isActive) return;
      if (splashFrame < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[splashFrame++]];
      } else {
        clearInterval(this.splashInterval);
      }
    }, 50);
    this.intervals.push(this.splashInterval);
  }

  cleanup() {
    if (this.throwInterval) clearInterval(this.throwInterval);
    if (this.splashInterval) clearInterval(this.splashInterval);
    super.cleanup();
  }
}
