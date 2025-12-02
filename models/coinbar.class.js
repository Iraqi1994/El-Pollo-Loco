class Coinbar extends Statusbar {
  IMAGES = [
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "./img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * Creates the coin status bar.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES[0]);
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 50;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }
}
