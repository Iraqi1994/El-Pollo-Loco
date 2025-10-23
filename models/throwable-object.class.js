class ThrowableObject extends MovableObject {
  speedX = 10;

  constructor(x, y) {
    super().loadImage("../img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    setInterval(() => {
      this.x += this.speedX;
    }, 25);
  }
}
