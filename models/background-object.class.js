class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;
  y = 0;
  /**
   * Creates a background layer.
   * @param {string} imagePath - Path to background image.
   * @param {number} x - X position.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
  }
}
