class Chick extends MovableObject {
  y = 380;
  width = 60;
  height = 60;
  IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  constructor(x) {
    super();
    this.loadImage("../img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.offset = { top: 5, right: 10, bottom: 0, left: 10 };
    this.x = x !== undefined ? x : 700 + Math.random() * 2000;
    this.speed = 1 + Math.random() * 0.25;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
