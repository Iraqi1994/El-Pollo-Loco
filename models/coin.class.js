class Coin extends DrawableObject {
  height = 150;
  width = 150;

  /**
   * Creates a collectible coin.
   * @param {number} x - X position.
   * @param {number} y - Y position.
   */
  constructor(x, y) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.offset = { top: 20, right: 20, bottom: 20, left: 20 };
  }
}
