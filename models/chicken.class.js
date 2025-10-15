class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  IMAGES_WALKING = [
    "../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super().loadImage("../img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
      if (this.currentImage >= this.IMAGES_WALKING.length) {
        this.currentImage = 0;
      }
      let path = this.IMAGES_WALKING[this.currentImage];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 200);
  }
}
