class Statusbar extends DrawableObject {
  IMAGES = [];
  percentage = 100;

  constructor() {
    super();
  }

  /**
   * Updates status bar based on percentage.
   * @param {number} percentage - Value from 0-100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Maps percentage to image index.
   * @returns {number} Image array index.
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    else if (this.percentage >= 80) return 4;
    else if (this.percentage >= 60) return 3;
    else if (this.percentage >= 40) return 2;
    else if (this.percentage >= 20) return 1;
    else return 0;
  }
}
