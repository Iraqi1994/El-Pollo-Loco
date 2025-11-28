class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2;
  energy = 100;
  lastHit = 0;
  gravityInterval;

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (!this.isActive) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
    this.intervals.push(this.gravityInterval);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
    this.lastInputTime = Date.now();
  }

  moveLeft() {
    this.x -= this.speed;
    if (this instanceof Character) {
      this.otherDirection = true;
      this.lastInputTime = Date.now();
    }
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  jump() {
    this.speedY = 25;
    this.lastInputTime = Date.now();
  }

  isColliding(movableObject) {
    if (movableObject instanceof Coin) {
      return this.isCollidingWithCircle(movableObject);
    }
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.top
    );
  }

  isJumpingOn(enemy) {
    return (
      this.speedY < 0 &&
      this.isAboveGround() &&
      this.y + this.height - this.offset.bottom > enemy.y + enemy.offset.top &&
      this.y + this.height - this.offset.bottom < enemy.y + enemy.height * 0.6 &&
      this.x + this.width - this.offset.right > enemy.x + enemy.offset.left &&
      this.x + this.offset.left < enemy.x + enemy.width - enemy.offset.right
    );
  }

  isCollidingWithCircle(coin) {
    const charCenterX = this.x + this.offset.left + (this.width - this.offset.left - this.offset.right) / 2;
    const charCenterY = this.y + this.offset.top + (this.height - this.offset.top - this.offset.bottom) / 2;
    const coinCenterX = coin.x + coin.width / 2;
    const coinCenterY = coin.y + coin.height / 2;
    const coinRadius = coin.width / 2 - coin.coinOffset;
    const distanceX = charCenterX - coinCenterX;
    const distanceY = charCenterY - coinCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const charRadius = Math.min(this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom) / 2;

    return distance < coinRadius + charRadius;
  }

  hit(damage) {
    if (this instanceof Endboss && this.isAttacking) {
      return;
    }
    this.energy -= damage;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  isDead() {
    return this.energy === 0;
  }

  cleanup() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
    }
    super.cleanup();
  }
}
