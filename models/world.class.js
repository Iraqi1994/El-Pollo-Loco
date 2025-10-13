class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  canvas;
  ctx;
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.character.img, this.character.x, this.character.y, this.character.width, this.character.height);
    this.enemies.forEach((chicken) => {
      this.ctx.drawImage(chicken.img, chicken.x, chicken.y, chicken.width, chicken.height);
    });

    requestAnimationFrame(() => this.draw());
  }
}
