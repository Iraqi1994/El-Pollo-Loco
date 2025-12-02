/**
 * Manages cleanup and removal of game entities.
 */
class CleanupManager {
  /**
   * Creates a cleanup manager.
   * @param {World} world - Reference to the game world.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Removes dead enemies after death animation delay.
   */
  removeDeadEnemies() {
    this.world.level.enemies = this.world.level.enemies.filter((enemy) => {
      if (this.isEnemyDead(enemy)) {
        return this.handleDeadEnemy(enemy);
      }
      return true;
    });
  }

  /**
   * Checks if an enemy is dead.
   * @param {MovableObject} enemy - Enemy to check.
   * @returns {boolean} True if dead.
   */
  isEnemyDead(enemy) {
    const isChickenDead = (enemy instanceof Chicken || enemy instanceof Chick) && enemy.chickenIsDead;
    const isBossDead = enemy instanceof Endboss && enemy.isDead() && enemy.deathAnimationFinished;
    return isChickenDead || isBossDead;
  }

  /**
   * Handles cleanup after enemy death delay.
   * @param {MovableObject} enemy - Dead enemy.
   * @returns {boolean} True if should keep in array.
   */
  handleDeadEnemy(enemy) {
    const timeSinceDeath = Date.now() - enemy.deathTime;
    const shouldRemove = timeSinceDeath >= 1000;
    if (shouldRemove && enemy.cleanup) {
      enemy.cleanup();
      if (enemy.world) enemy.world = null;
    }
    return !shouldRemove;
  }

  /**
   * Removes splashed bottles after animation.
   */
  removeSplashedBottles() {
    this.world.throwableObjects = this.world.throwableObjects.filter((bottle) => {
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

  /**
   * Cleans up all world resources and intervals.
   */
  cleanup() {
    this.world.isActive = false;
    this.cleanupAnimation();
    this.cleanupIntervals();
    this.cleanupCanvas();
    this.cleanupGameObjects();
    this.cleanupLevel();
    this.cleanupThrowableObjects();
    this.nullifyReferences();
  }

  /**
   * Cancels the animation frame loop.
   */
  cleanupAnimation() {
    if (this.world.animationFrameId) {
      cancelAnimationFrame(this.world.animationFrameId);
      this.world.animationFrameId = null;
    }
  }

  /**
   * Clears all game logic intervals.
   */
  cleanupIntervals() {
    this.world.intervals.forEach((interval) => clearInterval(interval));
    this.world.intervals = [];
  }

  /**
   * Clears and resets canvas.
   */
  cleanupCanvas() {
    if (this.world.ctx && this.world.canvas) {
      this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
      this.world.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
  }

  /**
   * Cleans up character and status bars.
   */
  cleanupGameObjects() {
    this.cleanupObject(this.world.character, true);
    this.cleanupObject(this.world.healthbar);
    this.cleanupObject(this.world.coinbar);
    this.cleanupObject(this.world.salsabar);
  }

  /**
   * Cleans up a single object.
   * @param {Object} obj - Object to clean.
   * @param {boolean} hasWorld - If object has world reference.
   * @returns {null}
   */
  cleanupObject(obj, hasWorld = false) {
    if (obj) {
      if (obj.cleanup) obj.cleanup();
      if (hasWorld) obj.world = null;
      return null;
    }
  }

  /**
   * Cleans up level and all its arrays.
   */
  cleanupLevel() {
    if (!this.world.level) return;
    this.cleanupLevelArray(this.world.level.enemies, true);
    this.cleanupLevelArray(this.world.level.clouds);
    this.cleanupLevelArray(this.world.level.backgroundObjects);
    this.cleanupLevelArray(this.world.level.coins);
    this.cleanupLevelArray(this.world.level.throwableObjects);
    this.world.level = null;
  }

  /**
   * Cleans up an array of level objects.
   * @param {Array} array - Array to clean.
   * @param {boolean} hasWorld - If objects have world reference.
   */
  cleanupLevelArray(array, hasWorld = false) {
    if (array) {
      array.forEach((obj) => {
        if (obj.cleanup) obj.cleanup();
        if (hasWorld && obj.world) obj.world = null;
      });
      array.length = 0;
    }
  }

  /**
   * Cleans up thrown bottles array.
   */
  cleanupThrowableObjects() {
    if (this.world.throwableObjects) {
      this.world.throwableObjects.forEach((obj) => {
        if (obj.cleanup) obj.cleanup();
      });
      this.world.throwableObjects = [];
    }
  }

  /**
   * Sets all object references to null.
   */
  nullifyReferences() {
    this.world.character = null;
    this.world.healthbar = null;
    this.world.coinbar = null;
    this.world.salsabar = null;
    this.world.ctx = null;
    this.world.canvas = null;
    this.world.keyboard = null;
  }
}
