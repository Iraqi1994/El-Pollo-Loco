class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  throwableObjects;
  level_end_x = 3480;
  /**
   * Creates a game level.
   * @param {Array} enemies - Enemy objects.
   * @param {Array} clouds - Cloud objects.
   * @param {Array} backgroundObjects - Background layers.
   * @param {Array} coins - Coin objects.
   * @param {Array} throwableObjects - Bottle objects.
   */
  constructor(enemies, clouds, backgroundObjects, coins, throwableObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.throwableObjects = throwableObjects;
  }
}
