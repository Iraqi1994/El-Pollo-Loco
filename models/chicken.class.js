class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  IMAGES_WALKING = ["./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png", "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png", "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"];
  IMAGES_DEAD = ["./img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];
  chickenIsDead = false;
  deathTime = 0;
  deathSound = new Audio("./audio/enemies/chicken_dead.wav");

  /**
   * Creates a chicken enemy.
   * @param {number} x - Spawn x position.
   * @param {number|null} spawnTriggerX - Character x that triggers spawn.
   */
  constructor(x, spawnTriggerX = null) {
    super().loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 10, right: 15, bottom: 0, left: 15 };
    this.x = x !== undefined ? x : 700 + Math.random() * 2000;
    this.speed = 2.5 + Math.random() * 1.5;
    this.deathSound.volume = 0.05;
    this.spawnTriggerX = spawnTriggerX !== null ? spawnTriggerX : x - 400;
    this.hasSpawned = spawnTriggerX === null;
    this.animate();
  }

  /**
   * Starts movement and animation intervals.
   */
  animate() {
    this.intervals.push(this.startMoving());
    this.intervals.push(this.setBasicAnimationIntervals());
  }

  /**
   * Starts the movement interval.
   * @returns {number} Interval ID.
   */
  startMoving() {
    setInterval(() => {
      if (gameActive && this.isActive && !this.chickenIsDead && this.hasSpawned) {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  /**
   * Animates walking or death.
   * @returns {number} Interval ID.
   */
  setBasicAnimationIntervals() {
    setInterval(() => {
      if (gameActive && this.isActive) {
        if (this.chickenIsDead) {
          this.playAnimation(this.IMAGES_DEAD);
        } else {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 200);
  }

  /**
   * Marks chicken as dead and plays sound.
   */
  die() {
    this.chickenIsDead = true;
    this.deathTime = Date.now();
    if (!isMuted) {
      this.deathSound.play();
    }
  }
}
