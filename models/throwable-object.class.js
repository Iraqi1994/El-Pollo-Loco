class ThrowableObject extends MovableObject {
  speedX = 15;

  constructor(x, y) {
    super().loadImage("../img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.offset = { top: 18, right: 15, bottom: 7, left: 25 };
  }

  throw() {
    this.speedY = 20;
    this.applyGravity();
    setInterval(() => {
      this.x += this.speedX;
    }, 25);
  }
}
