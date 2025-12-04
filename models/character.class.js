class Character extends MovableObject {
  height = 250;
  width = 120;
  speed = 10;
  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = ["./img/2_character_pepe/4_hurt/H-41.png", "./img/2_character_pepe/4_hurt/H-42.png", "./img/2_character_pepe/4_hurt/H-43.png"];

  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
    "./img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_IDLE = [
    "./img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_IDLE_LONG = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  world;
  coins = 0;
  bottles = 0;
  lastInputTime = Date.now();
  footstepSound = new Audio("./audio/character/footstep.wav");
  collectCoinSound = new Audio("./audio/character/collect_coin_sound.wav");
  jumpSound = new Audio("./audio/character/jump.wav");
  snoringSound = new Audio("./audio/character/snoring.mp3");
  isWalking = false;
  isSnoring = false;

  /**
   * Creates the main character with animations and sounds.
   */
  constructor() {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.offset = { top: 90, right: 20, bottom: 10, left: 20 };
    this.footstepSound.volume = 0.3;
    this.footstepSound.loop = true;
    this.footstepSound.playbackRate = 3.5;
    this.collectCoinSound.volume = 0.5;
    this.jumpSound.volume = 0.2;
    this.snoringSound.volume = 0.05;
    this.snoringSound.loop = true;
    this.applyGravity();
    this.animate();
  }

  jump() {
    super.jump();
    if (!isMuted) {
      this.jumpSound.play();
    }
  }

  hit(damage) {
    super.hit(damage);
    this.lastInputTime = Date.now();
    this.stopSnoringSound();
    if (this.isDead()) {
      this.stopFootstepSound();
    }
  }

  /**
   * Initializes all animation and movement intervals.
   */
  animate() {
    this.intervals.push(this.setBasicMovements());
    this.intervals.push(this.setBasicAnimationIntervals());
    this.intervals.push(this.startIdle());
    this.intervals.push(this.animateJumping());
  }

  /**
   * Sets up movement controls interval.
   * @returns {number} Interval ID.
   */
  setBasicMovements() {
    return setInterval(() => {
      if (gameActive && this.isActive && this.world) {
        if (this.world.keyboard.RIGHT && this.x + this.width - this.offset.right < this.getRightBoundary()) {
          this.moveRight();
        }
        if (this.world.keyboard.LEFT && this.x > this.getLeftBoundary()) {
          this.moveLeft();
        }
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
          this.jump();
        }
        this.setCameraWhenBossNotActive();
      }
    }, 1000 / 60);
  }

  /**
   * Sets up basic animation interval (walk, hurt, dead).
   * @returns {number} Interval ID.
   */
  setBasicAnimationIntervals() {
    return setInterval(() => {
      if (gameActive && this.isActive && this.world) {
        if (this.isDead()) {
          this.playAnimation(this.IMAGES_DEAD);
          this.stopFootstepSound();
          this.stopSnoringSound();
        } else if (this.isHurt()) {
          this.playAnimation(this.IMAGES_HURT);
          this.stopFootstepSound();
        } else {
          this.animateWalking();
        }
      }
    }, 50);
  }

  /**
   * Handles idle and sleeping animations.
   * @returns {number} Interval ID.
   */
  startIdle() {
    return setInterval(() => {
      if (this.shouldPlayIdleAnimation()) {
        const timeSinceLastInput = Date.now() - this.lastInputTime;
        if (timeSinceLastInput > 15000) {
          this.playAnimation(this.IMAGES_IDLE_LONG);
          this.playSnoringSound();
        } else {
          this.playAnimation(this.IMAGES_IDLE);
          this.stopSnoringSound();
        }
      } else {
        this.stopSnoringSound();
      }
    }, 250);
  }

  /**
   * Handles jumping animation.
   * @returns {number} Interval ID.
   */
  animateJumping() {
    return setInterval(() => {
      if (gameActive && this.isActive && this.isAboveGround() && !this.isDead() && !this.isHurt()) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 125);
  }

  /**
   * Plays walking animation and footstep sound.
   */
  animateWalking() {
    if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && !this.isAboveGround() && !this.isDead()) {
      this.playAnimation(this.IMAGES_WALKING);
      this.playFootstepSound();
    } else {
      this.stopFootstepSound();
    }
  }

  /**
   * Updates camera position to follow character.
   */
  setCameraWhenBossNotActive() {
    if (!this.world.isBossActive) {
      this.world.camera_x = -this.x + 70;
    }
  }

  /**
   * Checks if idle animation should play.
   * @returns {boolean} True if should play idle.
   */
  shouldPlayIdleAnimation() {
    return gameActive && this.isActive && this.world && !this.isAboveGround() && !this.isDead() && !this.isHurt() && !(this.world.keyboard.RIGHT || this.world.keyboard.LEFT);
  }

  /**
   * Increments coin count and plays sound.
   */
  collectCoin() {
    this.coins++;
    if (!isMuted) {
      this.collectCoinSound.currentTime = 0;
      this.collectCoinSound.play().catch(() => {});
    }
  }

  /**
   * Increments bottle count.
   */
  collectBottle() {
    this.bottles++;
  }

  /**
   * Starts playing footstep audio loop.
   */
  playFootstepSound() {
    if (!this.isWalking && !isMuted) {
      this.footstepSound.play().catch(() => {});
      this.isWalking = true;
    }
  }

  /**
   * Stops footstep audio.
   */
  stopFootstepSound() {
    if (this.isWalking) {
      this.footstepSound.pause();
      this.footstepSound.currentTime = 0;
      this.isWalking = false;
    }
  }

  /**
   * Starts playing snoring audio loop.
   */
  playSnoringSound() {
    if (!this.isSnoring && !isMuted) {
      this.snoringSound.play().catch(() => {});
      this.isSnoring = true;
    }
  }

  /**
   * Stops snoring audio.
   */
  stopSnoringSound() {
    if (this.isSnoring) {
      this.snoringSound.pause();
      this.snoringSound.currentTime = 0;
      this.isSnoring = false;
    }
  }

  /**
   * Gets the left movement boundary (for boss room).
   * @returns {number} Left boundary x position.
   */
  getLeftBoundary() {
    if (!this.world || !this.world.level) return 0;
    const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (!endboss) return 0;
    if (endboss.isActivated) {
      return endboss.leftBoundary - this.offset.left;
    }
    return 0;
  }

  /**
   * Gets the right movement boundary.
   * @returns {number} Right boundary x position.
   */
  getRightBoundary() {
    if (!this.world || !this.world.level) return 3500;
    const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (!endboss) return this.world.level.level_end_x;
    if (endboss.isActivated) {
      return endboss.rightBoundary;
    }
    return this.world.level.level_end_x;
  }

  /**
   * Stops all audio and cleans up character resources.
   */
  cleanup() {
    this.stopAllAudio();
    super.cleanup();
  }

  /**
   * Stops and cleans up all audio elements.
   */
  stopAllAudio() {
    this.stopFootstepSound();
    this.stopSnoringSound();

    const audioElements = [this.footstepSound, this.collectCoinSound, this.jumpSound, this.snoringSound];

    audioElements.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio.load();
      }
    });
  }
}
