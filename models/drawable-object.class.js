class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 100;
  y = 50;
  height = 150;
  width = 100;
  offset = { top: 0, right: 0, bottom: 0, left: 0 };
  coinOffset = 52;
  intervals = [];
  isActive = true;

  /**
   * Loads a single image from the given path.
   * @param {string} path - Image file path.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads an array of images into the cache.
   * @param {string[]} imageCache - Array of image paths.
   */
  loadImages(imageCache) {
    imageCache.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context.
   */
  draw(ctx) {
    if (this.img && this.img.complete && this.img.naturalHeight !== 0) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Cleans up intervals, images, and resources.
   */
  cleanup() {
    this.isActive = false;
    this.clearIntervalsArray();
    this.clearImagesCache();
    this.clearCurrentLoadedImage();
  }

  /**
   * Clears all active intervals.
   */
  clearIntervalsArray() {
    if (this.intervals && Array.isArray(this.intervals)) {
      this.intervals.forEach((interval) => {
        if (interval !== null && interval !== undefined) {
          clearInterval(interval);
        }
      });
      this.intervals = [];
    }
  }

  /**
   * Clears the image cache and releases memory.
   */
  clearImagesCache() {
    if (this.imageCache) {
      Object.keys(this.imageCache).forEach((key) => {
        const img = this.imageCache[key];
        if (img) {
          img.src = "";
          img.onload = null;
          img.onerror = null;
        }
      });
      this.imageCache = {};
    }
  }

  /**
   * Clears the currently loaded image.
   */
  clearCurrentLoadedImage() {
    if (this.img) {
      this.img.src = "";
      this.img.onload = null;
      this.img.onerror = null;
      this.img = null;
    }
  }
}
