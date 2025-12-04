class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthbar;
  healthbarBoss;
  coinbar;
  salsabar;
  throwableObjects = [];
  allCoins;
  maxBottles = 5;
  lastThrowTime = 0;
  throwCooldown = 500;
  isBossActive = false;
  bossRoomCameraX = 0;
  intervals = [];
  animationFrameId = null;
  isActive = true;

  /**
   * Creates the game world and initializes all entities.
   * @param {HTMLCanvasElement} canvas - Game canvas element.
   * @param {Keyboard} keyboard - Keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.character = new Character();
    this.level = createLevel1();
    this.healthbar = new Healthbar(20);
    this.healthbarBoss = new Healthbar(450);
    this.coinbar = new Coinbar();
    this.salsabar = new Salsabar();
    this.allCoins = this.level.coins.length;
    this.collisionManager = new CollisionManager(this);
    this.cleanupManager = new CleanupManager(this);
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Main render loop using requestAnimationFrame.
   */
  draw() {
    if (!this.isActive) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.healthbar);
    this.addToMap(this.coinbar);
    this.addToMap(this.salsabar);
    if (this.isBossActive) {
      this.addToMap(this.healthbarBoss);
    }
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Renders an array of objects to the canvas.
   * @param {DrawableObject[]} objects - Objects to render.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Renders a single object, handling flipping for direction.
   * @param {MovableObject} movableObject - Object to render.
   */
  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

  /**
   * Flips canvas context for left-facing sprites.
   * @param {MovableObject} movableObject - Object to flip.
   */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  /**
   * Restores canvas context after flipping.
   * @param {MovableObject} movableObject - Object to restore.
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }

  /**
   * Sets world reference on character and endboss.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  /**
   * Starts the main game logic loop.
   */
  run() {
    this.intervals.push(
      setInterval(() => {
        if (!this.isActive) return;
        this.checkEnemySpawns();
        this.collisionManager.checkCollisions();
        this.checkThrowableObjects();
        this.checkCollectibles();
        this.collisionManager.checkBottleEnemyCollisions();
        this.cleanupManager.removeDeadEnemies();
        this.cleanupManager.removeSplashedBottles();
        this.checkBossActivation();
        this.checkGameEnd();
      }, 1000 / 60)
    );
  }

  /**
   * Activates enemies when character reaches spawn trigger.
   */
  checkEnemySpawns() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.hasSpawned && enemy.spawnTriggerX !== undefined) {
        if (this.character.x >= enemy.spawnTriggerX) {
          enemy.hasSpawned = true;
        }
      }
    });
  }

  /**
   * Checks and handles coin and bottle collection.
   */
  checkCollectibles() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.collectCoin();
        this.level.coins.splice(index, 1);
        this.updateCoinbar();
      }
    });

    this.level.throwableObjects.forEach((bottle, index) => {
      if (this.character.isColliding(bottle) && this.character.bottles < this.maxBottles) {
        this.character.collectBottle();
        this.level.throwableObjects.splice(index, 1);
        this.updateSalsabar();
      }
    });
  }

  /**
   * Handles bottle throwing with cooldown.
   */
  checkThrowableObjects() {
    const currentTime = Date.now();
    if (this.keyboard.D && this.character.bottles > 0 && currentTime - this.lastThrowTime > this.throwCooldown) {
      const throwLeft = this.character.otherDirection;
      const offsetX = throwLeft ? -50 : 50;
      let bottle = new ThrowableObject(this.character.x + offsetX, this.character.y + 100, throwLeft);
      bottle.throw();
      this.throwableObjects.push(bottle);
      this.character.bottles--;
      this.updateSalsabar();
      this.lastThrowTime = currentTime;
    }
  }

  /**
   * Updates coin status bar percentage.
   */
  updateCoinbar() {
    const percentage = (this.character.coins / this.allCoins) * 100;
    this.coinbar.setPercentage(percentage);
  }

  /**
   * Updates bottle status bar percentage.
   */
  updateSalsabar() {
    const percentage = (this.character.bottles / this.maxBottles) * 100;
    this.salsabar.setPercentage(percentage);
  }

  /**
   * Activates boss fight when character reaches boss area.
   */
  checkBossActivation() {
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && !endboss.isActivated) {
      const bossFullyVisibleAt = endboss.x + endboss.width - 720;
      if (this.character.x >= bossFullyVisibleAt) {
        this.isBossActive = true;
        this.bossRoomCameraX = this.camera_x;
        endboss.activate(this.bossRoomCameraX);
      }
    }
  }

  /**
   * Checks win/lose conditions and shows ending screen.
   */
  checkGameEnd() {
    if (this.character.isDead() && gameActive) {
      showEndingScreen(false);
    }
    if (!this.level) return;
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && endboss.isDead() && endboss.deathAnimationFinished && gameActive) {
      showEndingScreen(true);
    }
  }

  /**
   * Cleans up all world resources and intervals.
   */
  cleanup() {
    this.cleanupManager.cleanup();
  }
}
