class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  throwableObjects;
  level_end_x = 3500;
  constructor(enemies, clouds, backgroundObjects, coins, throwableObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.throwableObjects = throwableObjects;
  }
}
