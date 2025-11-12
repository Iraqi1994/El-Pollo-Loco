class ThrowableObject extends MovableObject {
  speedX = 15;

  IMAGES_THROWING = [
    "../img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "../img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "../img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "../img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "../img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "../img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "../img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "../img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "../img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "../img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super().loadImage("../img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_THROWING);
    this.loadImages(this.IMAGES_SPLASH);
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
