class Character extends MovableObject {
  height = 250;
  width = 120;
  speed = 10;
  IMAGES_WALKING = [
    "../img/2_character_pepe/2_walk/W-21.png",
    "../img/2_character_pepe/2_walk/W-22.png",
    "../img/2_character_pepe/2_walk/W-23.png",
    "../img/2_character_pepe/2_walk/W-24.png",
    "../img/2_character_pepe/2_walk/W-25.png",
    "../img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "../img/2_character_pepe/3_jump/J-31.png",
    "../img/2_character_pepe/3_jump/J-32.png",
    "../img/2_character_pepe/3_jump/J-33.png",
    "../img/2_character_pepe/3_jump/J-34.png",
    "../img/2_character_pepe/3_jump/J-35.png",
    "../img/2_character_pepe/3_jump/J-36.png",
    "../img/2_character_pepe/3_jump/J-37.png",
    "../img/2_character_pepe/3_jump/J-38.png",
    "../img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = ["../img/2_character_pepe/4_hurt/H-41.png", "../img/2_character_pepe/4_hurt/H-42.png", "../img/2_character_pepe/4_hurt/H-43.png"];

  IMAGES_DEAD = [
    "../img/2_character_pepe/5_dead/D-51.png",
    "../img/2_character_pepe/5_dead/D-52.png",
    "../img/2_character_pepe/5_dead/D-53.png",
    "../img/2_character_pepe/5_dead/D-54.png",
    "../img/2_character_pepe/5_dead/D-55.png",
    "../img/2_character_pepe/5_dead/D-56.png",
    "../img/2_character_pepe/5_dead/D-57.png",
  ];

  world;
  coins = 0;
  bottles = 0;

  constructor() {
    super().loadImage("../img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 90, right: 20, bottom: 10, left: 20 };
    this.applyGravity();
    this.animate();
  }

  animate() {
    let wasAboveGround = false;
    let wasHurt = false;

    setInterval(() => {
      if (this.world.keyboard.RIGHT && this.x + this.width - this.offset.right < this.getRightBoundary()) {
        this.moveRight();
        this.otherDirection = false;
      }

      if (this.world.keyboard.LEFT && this.x > this.getLeftBoundary()) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if (this.world.keyboard.SPACE && !this.isAboveGround()) {
        this.jump();
      }

      if (wasAboveGround && !this.isAboveGround()) {
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
        this.currentImage = 0;
      }
      wasAboveGround = this.isAboveGround();

      if (!this.world.isBossActive) {
        this.world.camera_x = -this.x + 70;
      }
    }, 1000 / 60);

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        wasHurt = true;
      } else {
        if (wasHurt) {
          this.img = this.imageCache[this.IMAGES_WALKING[0]];
          this.currentImage = 0;
          wasHurt = false;
        }
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround()) {
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 50);

    setInterval(() => {
      if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 125);
  }

  collectCoin() {
    this.coins++;
  }

  collectBottle() {
    this.bottles++;
  }

  getLeftBoundary() {
    const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (!endboss) return 0;
    if (endboss.isActivated) {
      return endboss.leftBoundary - this.offset.left;
    }
    return 0;
  }

  getRightBoundary() {
    const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (!endboss) return this.world.level.level_end_x;
    if (endboss.isActivated) {
      return endboss.rightBoundary;
    }
    return this.world.level.level_end_x;
  }
}
