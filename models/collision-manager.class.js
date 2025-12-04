/**
 * Manages all collision detection and handling for the game world.
 */
class CollisionManager {
  /**
   * Creates a collision manager.
   * @param {World} world - Reference to the game world.
   */
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks all enemy collisions with character.
   */
  checkCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      this.handleEnemyCollision(enemy);
    });
  }

  /**
   * Handles collision logic for a single enemy.
   * @param {MovableObject} enemy - Enemy to check.
   */
  handleEnemyCollision(enemy) {
    if (this.isChickenJumpedOn(enemy)) {
      this.handleChickenJumpKill(enemy);
    } else if (this.isBossJumpedOn(enemy)) {
      this.handleBossJump(enemy);
    } else if (this.isCharacterTouchingEnemy(enemy)) {
      this.handleCharacterDamage();
    }
  }

  /**
   * Checks if character jumped on a chicken/chick.
   * @param {MovableObject} enemy - Enemy to check.
   * @returns {boolean} True if jumped on chicken.
   */
  isChickenJumpedOn(enemy) {
    return (enemy instanceof Chicken || enemy instanceof Chick) && !enemy.chickenIsDead && this.world.character.isJumpingOn(enemy);
  }

  /**
   * Checks if character jumped on boss.
   * @param {MovableObject} enemy - Enemy to check.
   * @returns {boolean} True if jumped on boss.
   */
  isBossJumpedOn(enemy) {
    return enemy instanceof Endboss && this.world.character.isJumpingOn(enemy) && !enemy.isDead();
  }

  /**
   * Checks if character is touching enemy (takes damage).
   * @param {MovableObject} enemy - Enemy to check.
   * @returns {boolean} True if touching.
   */
  isCharacterTouchingEnemy(enemy) {
    if (enemy instanceof Endboss) {
      return this.world.character.isColliding(enemy) && !this.world.character.isHurt() && !enemy.isDead() && enemy.isAttacking;
    }
    return this.world.character.isColliding(enemy) && !enemy.chickenIsDead && !this.world.character.isHurt();
  }

  /**
   * Kills chicken and bounces character.
   * @param {Chicken|Chick} enemy - Enemy to kill.
   */
  handleChickenJumpKill(enemy) {
    enemy.die();
    this.world.character.speedY = 8;
  }

  /**
   * Damages boss and bounces character.
   * @param {Endboss} enemy - Boss to damage.
   */
  handleBossJump(enemy) {
    enemy.hit(20);
    this.world.healthbarBoss.setPercentage(enemy.energy);
    this.world.character.speedY = 8;
  }

  /**
   * Applies damage to character and updates healthbar.
   */
  handleCharacterDamage() {
    this.world.character.hit(20);
    this.world.healthbar.setPercentage(this.world.character.energy);
  }

  /**
   * Checks thrown bottle collisions with enemies.
   */
  checkBottleEnemyCollisions() {
    this.world.throwableObjects.forEach((bottle) => {
      this.world.level.enemies.forEach((enemy) => {
        if (!bottle.isSplashing && bottle.isColliding(enemy)) {
          if ((enemy instanceof Chicken || enemy instanceof Chick) && !enemy.chickenIsDead) {
            bottle.splash();
            enemy.die();
          } else if (enemy instanceof Endboss && enemy.isActivated) {
            bottle.splash();
            enemy.hit(20);
            this.world.healthbarBoss.setPercentage(enemy.energy);
          }
        }
      });
    });
  }
}
