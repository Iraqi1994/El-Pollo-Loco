class Chick extends MovableObject {
  y = 380;
  width = 60;
  height = 60;
  IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["../img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
  chickenIsDead = false;
  deathTime = 0;
  deathSound = new Audio("../audio/enemies/chick_dead.wav");

  constructor(x) {
    super().loadImage("../img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 5, right: 10, bottom: 0, left: 10 };
    this.x = x !== undefined ? x : 700 + Math.random() * 2000;
    this.speed = 1 + Math.random() * 0.25;
    this.deathSound.volume = 0.1;
    this.animate();
  }

  animate() {
    this.intervals.push(this.startMoving());
    this.intervals.push(this.setBasicAnimationIntervals());
  }

  startMoving() {
    setInterval(() => {
      if (gameActive && this.isActive && !this.chickenIsDead) {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

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

  die() {
    this.chickenIsDead = true;
    this.deathTime = Date.now();
    if (!isMuted) {
      this.deathSound.play();
    }
  }
}
