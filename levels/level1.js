/**
 * Creates and returns level 1 with all entities.
 * @returns {Level} Level instance.
 */
function createLevel1() {
  return new Level(
    [
      new Chick(1000),
      new Chick(1800),
      new Chick(2600),
      new Chick(3200, 600),
      new Chick(3600, 900),
      new Chick(4000, 1200),
      new Chicken(1400),
      new Chicken(2000),
      new Chicken(2800),
      new Chicken(3400, 700),
      new Chicken(3800, 1000),
      new Chicken(4200, 1300),
      new Endboss(),
    ],
    [new Cloud()],
    [
      new BackgroundObject("./img/5_background/layers/air.png", -719),
      new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", -719),

      new BackgroundObject("./img/5_background/layers/air.png", 0),
      new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("./img/5_background/layers/air.png", 719),
      new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 719),

      new BackgroundObject("./img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 719 * 2),
      new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 719 * 2),
      new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 719 * 2),

      new BackgroundObject("./img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 719 * 3),

      new BackgroundObject("./img/5_background/layers/air.png", 719 * 4),
      new BackgroundObject("./img/5_background/layers/3_third_layer/1.png", 719 * 4),
      new BackgroundObject("./img/5_background/layers/2_second_layer/1.png", 719 * 4),
      new BackgroundObject("./img/5_background/layers/1_first_layer/1.png", 719 * 4),

      new BackgroundObject("./img/5_background/layers/air.png", 719 * 5),
      new BackgroundObject("./img/5_background/layers/3_third_layer/2.png", 719 * 5),
      new BackgroundObject("./img/5_background/layers/2_second_layer/2.png", 719 * 5),
      new BackgroundObject("./img/5_background/layers/1_first_layer/2.png", 719 * 5),
    ],
    [
      new Coin(400, 300),
      new Coin(600, 250),
      new Coin(750, 200),
      new Coin(900, 150),
      new Coin(1050, 280),
      new Coin(1200, 220),
      new Coin(1400, 180),
      new Coin(1550, 260),
      new Coin(1700, 200),
      new Coin(1900, 150),
      new Coin(2050, 300),
      new Coin(2200, 240),
      new Coin(2400, 190),
      new Coin(2600, 270),
      new Coin(2750, 210),
      new Coin(2900, 160),
      new Coin(3100, 250),
      new Coin(3250, 200),
    ],
    [
      new ThrowableObject(500, 360),
      new ThrowableObject(950, 360),
      new ThrowableObject(1400, 360),
      new ThrowableObject(1850, 360),
      new ThrowableObject(2300, 360),
      new ThrowableObject(2750, 360),
      new ThrowableObject(3200, 360),
      new ThrowableObject(3450, 360),
    ]
  );
}
