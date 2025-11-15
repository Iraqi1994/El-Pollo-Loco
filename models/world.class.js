class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  healthbar = new Healthbar();
  coinbar = new Coinbar();
  salsabar = new Salsabar();
  throwableObjects = [];
  allCoins = this.level.coins.length;
  maxBottles = 5;
  lastThrowTime = 0;
  throwCooldown = 500;
  isBossActive = false;
  bossRoomCameraX = 0;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  draw() {
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
    requestAnimationFrame(() => this.draw());
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
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowableObjects();
      this.checkCollectibles();
      this.checkBottleEnemyCollisions();
      this.removeDeadEnemies();
      this.removeSplashedBottles();
      this.checkBossActivation();
    }, 1000 / 60);
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
      if ((enemy instanceof Chicken || enemy instanceof Chick) && enemy.chickenIsDead) {
        const timeSinceDeath = Date.now() - enemy.deathTime;
        return timeSinceDeath < 1000;
      }
      if (enemy instanceof Endboss && enemy.isDead() && enemy.deathAnimationFinished) {
        const timeSinceDeath = Date.now() - enemy.deathTime;
        return timeSinceDeath < 1000;
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
        return timeSinceSplash < 300;
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
}
