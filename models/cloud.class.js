class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  /**
   * Creates an animated cloud.
   */
  constructor() {
    super().loadImage("../img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Moves cloud left continuously.
   */
  animate() {
    this.intervals.push(
      setInterval(() => {
        if (this.isActive) {
          this.moveLeft();
        }
      }, 1000 / 60)
    );
  }
}
