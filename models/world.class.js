class World {
  character;
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthbar;
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

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.character = new Character();
    this.level = createLevel1();
    this.healthbar = new Healthbar();
    this.coinbar = new Coinbar();
    this.salsabar = new Salsabar();
    this.allCoins = this.level.coins.length;
    this.draw();
    this.setWorld();
    this.run();
  }

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
    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.throwableObjects);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    movableObject.drawFrame(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
      }
    });
  }

  run() {
    this.intervals.push(
      setInterval(() => {
        if (!this.isActive) return;
        this.checkCollisions();
        this.checkThrowableObjects();
        this.checkCollectibles();
        this.checkBottleEnemyCollisions();
        this.removeDeadEnemies();
        this.removeSplashedBottles();
        this.checkBossActivation();
        this.checkGameEnd();
      }, 1000 / 60)
    );
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      this.handleEnemyCollision(enemy);
    });
  }

  handleEnemyCollision(enemy) {
    if (this.isChickenJumpedOn(enemy)) {
      this.handleChickenJumpKill(enemy);
    } else if (this.isBossJumpedOn(enemy)) {
      this.handleBossJump(enemy);
    } else if (this.isCharacterTouchingEnemy(enemy)) {
      this.handleCharacterDamage();
    }
  }

  isChickenJumpedOn(enemy) {
    return (enemy instanceof Chicken || enemy instanceof Chick) && !enemy.chickenIsDead && this.character.isJumpingOn(enemy);
  }

  isBossJumpedOn(enemy) {
    return enemy instanceof Endboss && this.character.isJumpingOn(enemy) && !enemy.isDead();
  }

  isCharacterTouchingEnemy(enemy) {
    return (
      this.character.isColliding(enemy) && !enemy.chickenIsDead && !this.character.isHurt() && !(enemy instanceof Endboss && enemy.isDead())
    );
  }

  handleChickenJumpKill(enemy) {
    enemy.die();
    this.character.speedY = 8;
  }

  handleBossJump(enemy) {
    enemy.hit(20);
    this.character.speedY = 8;
  }

  handleCharacterDamage() {
    this.character.hit(5);
    this.healthbar.setPercentage(this.character.energy);
  }

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

  updateCoinbar() {
    const percentage = (this.character.coins / this.allCoins) * 100;
    this.coinbar.setPercentage(percentage);
  }

  updateSalsabar() {
    const percentage = (this.character.bottles / this.maxBottles) * 100;
    this.salsabar.setPercentage(percentage);
  }

  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter((enemy) => {
      if (this.isEnemyDead(enemy)) {
        return this.handleDeadEnemy(enemy);
      }
      return true;
    });
  }

  isEnemyDead(enemy) {
    const isChickenDead = (enemy instanceof Chicken || enemy instanceof Chick) && enemy.chickenIsDead;
    const isBossDead = enemy instanceof Endboss && enemy.isDead() && enemy.deathAnimationFinished;
    return isChickenDead || isBossDead;
  }

  handleDeadEnemy(enemy) {
    const timeSinceDeath = Date.now() - enemy.deathTime;
    const shouldRemove = timeSinceDeath >= 1000;
    if (shouldRemove && enemy.cleanup) {
      enemy.cleanup();
      if (enemy.world) enemy.world = null;
    }
    return !shouldRemove;
  }

  checkBottleEnemyCollisions() {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemies.forEach((enemy) => {
        if (!bottle.isSplashing && bottle.isColliding(enemy)) {
          if ((enemy instanceof Chicken || enemy instanceof Chick) && !enemy.chickenIsDead) {
            bottle.splash();
            enemy.die();
          } else if (enemy instanceof Endboss && enemy.isActivated) {
            bottle.splash();
            enemy.hit(20);
          }
        }
      });
    });
  }

  removeSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      if (bottle.isSplashing) {
        const timeSinceSplash = Date.now() - bottle.splashStartTime;
        const shouldRemove = timeSinceSplash >= 300;

        if (shouldRemove && bottle.cleanup) {
          bottle.cleanup();
        }

        return !shouldRemove;
      }
      return true;
    });
  }

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

  checkGameEnd() {
    if (this.character.isDead() && gameActive) {
      showEndingScreen(false);
    }

    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss);
    if (endboss && endboss.isDead() && endboss.deathAnimationFinished && gameActive) {
      showEndingScreen(true);
    }
  }

  cleanup() {
    this.isActive = false;
    this.cleanupAnimation();
    this.cleanupIntervals();
    this.cleanupCanvas();
    this.cleanupGameObjects();
    this.cleanupLevel();
    this.cleanupThrowableObjects();
    this.nullifyReferences();
  }

  cleanupAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  cleanupIntervals() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
  }

  cleanupCanvas() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  cleanupGameObjects() {
    this.cleanupObject(this.character, true);
    this.cleanupObject(this.healthbar);
    this.cleanupObject(this.coinbar);
    this.cleanupObject(this.salsabar);
  }

  cleanupObject(obj, hasWorld = false) {
    if (obj) {
      if (obj.cleanup) obj.cleanup();
      if (hasWorld) obj.world = null;
      return null;
    }
  }

  cleanupLevel() {
    if (!this.level) return;
    this.cleanupLevelArray(this.level.enemies, true);
    this.cleanupLevelArray(this.level.clouds);
    this.cleanupLevelArray(this.level.backgroundObjects);
    this.cleanupLevelArray(this.level.coins);
    this.cleanupLevelArray(this.level.throwableObjects);
    this.level = null;
  }

  cleanupLevelArray(array, hasWorld = false) {
    if (array) {
      array.forEach((obj) => {
        if (obj.cleanup) obj.cleanup();
        if (hasWorld && obj.world) obj.world = null;
      });
      array.length = 0;
    }
  }

  cleanupThrowableObjects() {
    if (this.throwableObjects) {
      this.throwableObjects.forEach((obj) => {
        if (obj.cleanup) obj.cleanup();
      });
      this.throwableObjects = [];
    }
  }

  nullifyReferences() {
    this.character = null;
    this.healthbar = null;
    this.coinbar = null;
    this.salsabar = null;
    this.ctx = null;
    this.canvas = null;
    this.keyboard = null;
  }
}
