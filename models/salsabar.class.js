class Salsabar extends Statusbar {
  IMAGES = [
    "../img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "../img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "../img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "../img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "../img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "../img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 100;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }
}
