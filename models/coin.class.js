class Coin extends DrawableObject {
  height = 150;
  width = 150;

  constructor(x, y) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.offset = { top: 20, right: 20, bottom: 20, left: 20 };
  }
}
