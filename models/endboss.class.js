class Endboss extends MovableObject {
  height = 250;
  width = 180;
  y = 200;
  speed = 5;
  deathAnimationFinished = false;
  deathAnimationStarted = false;
  deathTime = 0;
  isActivated = false;
  movingRight = false;
  leftBoundary = 0;
  rightBoundary = 0;
  isAttacking = false;
  attackAnimationStarted = false;
  attackStartTime = 0;
  hasDealtDamage = false;
  activationTimeout = null;
  warcrySound = new Audio("./audio/enemies/endboss_warcry.wav");
  attackSound = new Audio("./audio/enemies/endboss_attack.wav");

  IMAGES_WALKING = ["./img/4_enemie_boss_chicken/1_walk/G1.png", "./img/4_enemie_boss_chicken/1_walk/G2.png", "./img/4_enemie_boss_chicken/1_walk/G3.png", "./img/4_enemie_boss_chicken/1_walk/G4.png"];

  IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = ["./img/4_enemie_boss_chicken/4_hurt/G21.png", "./img/4_enemie_boss_chicken/4_hurt/G22.png", "./img/4_enemie_boss_chicken/4_hurt/G23.png"];

  IMAGES_DEAD = ["./img/4_enemie_boss_chicken/5_dead/G24.png", "./img/4_enemie_boss_chicken/5_dead/G25.png", "./img/4_enemie_boss_chicken/5_dead/G26.png"];

  /**
   * Creates the endboss with all animations.
   */
  constructor() {
    super().loadImage("./img/4_enemie_boss_chicken/2_alert/G5.png");
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.offset = { top: 50, right: 25, bottom: 30, left: 20 };
    this.x = 3300;
    this.world = null;
    this.warcrySound.volume = 0.3;
    this.attackSound.volume = 0.4;
    this.animate();
    this.startMoving();
  }

  /**
   * Handles boss animation states.
   */
  animate() {
    this.intervals.push(
      setInterval(() => {
        if (gameActive && this.isActive) {
          if (this.isDead() && !this.deathAnimationFinished) {
            this.playDeathAnimation(this.IMAGES_DEAD);
          } else if (this.isDead() && this.deathAnimationFinished) {
          } else if (this.isAttacking) {
            this.playAttackAnimation();
          } else if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
          } else if (this.isActivated && !this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
          } else if (!this.isDead()) {
            this.playAnimation(this.IMAGES_ALERT);
          }
        }
      }, 200)
    );
  }

  /**
   * Starts boss movement within boundaries.
   */
  startMoving() {
    this.intervals.push(
      setInterval(() => {
        if (gameActive && this.isActive && !this.isDead() && this.isActivated && !this.isAttacking) {
          if (this.movingRight) {
            this.moveRight();
            this.otherDirection = true;
            if (this.x + this.width >= this.rightBoundary) {
              this.startAttack();
              this.movingRight = false;
            }
          } else {
            this.moveLeft();
            this.otherDirection = false;
            if (this.x <= this.leftBoundary) {
              this.startAttack();
              this.movingRight = true;
            }
          }
        }
      }, 1000 / 60)
    );
  }

  /**
   * Activates boss fight and sets boundaries.
   * @param {number} cameraX - Current camera x position.
   */
  activate(cameraX) {
    if (!this.isActivated) {
      this.leftBoundary = -cameraX;
      this.rightBoundary = -cameraX + 720;
      if (!isMuted) {
        this.warcrySound.currentTime = 0;
        this.warcrySound.play().catch(() => {});
      }
      this.activationTimeout = setTimeout(() => {
        if (this.isActive) {
          this.isActivated = true;
        }
      }, 1000);
    }
  }

  /**
   * Plays death animation once without looping.
   * @param {string[]} images - Death animation frames.
   */
  playDeathAnimation(images) {
    if (!this.deathAnimationStarted) {
      this.currentImage = 0;
      this.deathAnimationStarted = true;
    }
    if (this.currentImage < images.length) {
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
      if (this.currentImage >= images.length) {
        this.deathAnimationFinished = true;
        this.deathTime = Date.now();
      }
    }
  }

  /**
   * Initiates attack sequence.
   */
  startAttack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.attackAnimationStarted = false;
      this.attackStartTime = Date.now();
      this.currentImage = 0;
      this.hasDealtDamage = false;
    }
  }

  /**
   * Plays attack animation with timing.
   */
  playAttackAnimation() {
    if (!this.attackAnimationStarted) {
      this.initializeAttackAnimation();
    }
    this.updateAttackAnimation();
  }

  /**
   * Initializes attack animation and plays sound.
   */
  initializeAttackAnimation() {
    this.currentImage = 0;
    this.attackAnimationStarted = true;
    if (!isMuted) {
      this.attackSound.currentTime = 0;
      this.attackSound.play().catch(() => {});
    }
  }

  /**
   * Updates attack animation based on timing.
   */
  updateAttackAnimation() {
    const animationDuration = this.IMAGES_ATTACK.length * 200 * 2;
    const timeSinceAttackStart = Date.now() - this.attackStartTime;
    if (timeSinceAttackStart < animationDuration) {
      this.playAttackFrames(timeSinceAttackStart);
    } else {
      this.endAttack();
    }
  }

  /**
   * Plays attack frames and handles damage timing.
   * @param {number} timeSinceAttackStart - Time since attack began.
   */
  playAttackFrames(timeSinceAttackStart) {
    const previousImage = this.currentImage;
    this.playAnimation(this.IMAGES_ATTACK);
    this.handleAttackSound(previousImage);
    this.handleAttackDamage(timeSinceAttackStart);
  }

  /**
   * Replays attack sound on animation loop.
   * @param {number} previousImage - Previous image index.
   */
  handleAttackSound(previousImage) {
    if (!isMuted && previousImage > this.currentImage) {
      this.attackSound.currentTime = 0;
      this.attackSound.play().catch(() => {});
    }
  }

  /**
   * Applies damage during attack window.
   * @param {number} timeSinceAttackStart - Time since attack began.
   */
  handleAttackDamage(timeSinceAttackStart) {
    const damageWindow = 200 * 4;
    const isInDamageWindow = timeSinceAttackStart >= damageWindow && timeSinceAttackStart < damageWindow + 200;
    if (!this.hasDealtDamage && isInDamageWindow && this.world && this.isCharacterInFront()) {
      this.world.character.hit(20);
      this.world.healthbar.setPercentage(this.world.character.energy);
      this.hasDealtDamage = true;
    }
  }

  /**
   * Ends attack state.
   */
  endAttack() {
    this.isAttacking = false;
    this.attackAnimationStarted = false;
  }

  /**
   * Checks if character is in front of boss.
   * @returns {boolean} True if character is in attack range.
   */
  isCharacterInFront() {
    if (!this.world) return false;
    const character = this.world.character;
    const attackRange = 150;
    if (this.otherDirection) {
      return character.x > this.x && character.x < this.x + this.width + attackRange;
    } else {
      return character.x + character.width > this.x - attackRange && character.x < this.x;
    }
  }

  /**
   * Cleans up boss resources and timeout.
   */
  cleanup() {
    if (this.activationTimeout) {
      clearTimeout(this.activationTimeout);
      this.activationTimeout = null;
    }
    super.cleanup();
  }
}
