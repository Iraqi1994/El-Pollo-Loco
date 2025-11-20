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
      if ((enemy instanceof Chicken || enemy instanceof Chick) && !enemy.chickenIsDead && this.character.isJumpingOn(enemy)) {
        enemy.die();
        this.character.speedY = 15;
      } else if (enemy instanceof Endboss && this.character.isJumpingOn(enemy) && !enemy.isDead()) {
        enemy.hit(20);
        this.character.speedY = 15;
      } else if (this.character.isColliding(enemy) && !enemy.chickenIsDead && !this.character.isHurt() && !(enemy instanceof Endboss && enemy.isDead())) {
        this.character.hit(5);
        this.healthbar.setPercentage(this.character.energy);
      }
    });
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
      const isChickenDead = (enemy instanceof Chicken || enemy instanceof Chick) && enemy.chickenIsDead;
      const isBossDead = enemy instanceof Endboss && enemy.isDead() && enemy.deathAnimationFinished;

      if (isChickenDead || isBossDead) {
        const timeSinceDeath = Date.now() - enemy.deathTime;
        const shouldRemove = timeSinceDeath >= 1000;

        if (shouldRemove && enemy.cleanup) {
          enemy.cleanup();
          if (enemy.world) enemy.world = null;
        }

        return !shouldRemove;
      }
      return true;
    });
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

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    if (this.character) {
      if (this.character.cleanup) this.character.cleanup();
      this.character.world = null;
      this.character = null;
    }

    if (this.healthbar) {
      if (this.healthbar.cleanup) this.healthbar.cleanup();
      this.healthbar = null;
    }
    if (this.coinbar) {
      if (this.coinbar.cleanup) this.coinbar.cleanup();
      this.coinbar = null;
    }
    if (this.salsabar) {
      if (this.salsabar.cleanup) this.salsabar.cleanup();
      this.salsabar = null;
    }

    if (this.level) {
      if (this.level.enemies) {
        this.level.enemies.forEach((enemy) => {
          if (enemy.cleanup) enemy.cleanup();
          if (enemy.world) enemy.world = null;
        });
        this.level.enemies = [];
      }

      if (this.level.clouds) {
        this.level.clouds.forEach((cloud) => {
          if (cloud.cleanup) cloud.cleanup();
        });
        this.level.clouds = [];
      }

      if (this.level.backgroundObjects) {
        this.level.backgroundObjects.forEach((bg) => {
          if (bg.cleanup) bg.cleanup();
        });
        this.level.backgroundObjects = [];
      }

      if (this.level.coins) {
        this.level.coins.forEach((coin) => {
          if (coin.cleanup) coin.cleanup();
        });
        this.level.coins = [];
      }

      if (this.level.throwableObjects) {
        this.level.throwableObjects.forEach((obj) => {
          if (obj.cleanup) obj.cleanup();
        });
        this.level.throwableObjects = [];
      }

      this.level = null;
    }

    if (this.throwableObjects) {
      this.throwableObjects.forEach((obj) => {
        if (obj.cleanup) obj.cleanup();
      });
      this.throwableObjects = [];
    }

    this.ctx = null;
    this.canvas = null;
    this.keyboard = null;
  }
}
