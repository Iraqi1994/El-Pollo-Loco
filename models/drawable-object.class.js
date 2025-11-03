class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 100;
  y = 50;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(imageCache) {
    imageCache.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
    if (this instanceof Coin) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}
