class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor(x) {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.offset = { top: 10, right: 15, bottom: 0, left: 15 };
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
