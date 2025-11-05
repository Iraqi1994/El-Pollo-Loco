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
    if (this instanceof Character || this instanceof Chicken || this instanceof ThrowableObject || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      ctx.rect(
        this.x + this.offset.left,
        this.y + this.offset.top,
        this.width - this.offset.right - this.offset.left,
        this.height - this.offset.bottom - this.offset.top
      );
      ctx.stroke();
    }
    if (this instanceof Coin) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;
      const radius = this.width / 2;
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red";
      const offsetCenterX = this.x + this.width / 2;
      const offsetCenterY = this.y + this.height / 2;
      const offsetRadius = this.width / 2 - this.coinOffset;
      ctx.arc(offsetCenterX, offsetCenterY, offsetRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}
