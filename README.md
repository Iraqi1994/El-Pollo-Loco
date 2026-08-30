# El Pollo Loco 🌮🐔

A vanilla JavaScript 2D side-scrolling platformer built with HTML5 Canvas — no frameworks, no build tools. Guide Pepe through a chicken-infested desert, collect coins and salsa bottles, and defeat the giant Endboss chicken.

## Play

Just open [index.html](index.html) in a browser (or use a tool like VS Code's Live Server for hot reload). There is no build step or dependency installation required.

## Controls

| Key       | Action          |
| --------- | --------------- |
| `←` / `→` | Move left/right |
| `SPACE`   | Jump            |
| `D`       | Throw bottle    |

On-screen touch controls are provided automatically for mobile/tablet devices, along with a landscape-orientation prompt.

### Tips

- You can carry up to 5 salsa bottles at a time.
- The Endboss can be damaged by jumping on it or throwing bottles, and needs 5 hits to die.
- The Endboss cannot be hit while attacking.

## Architecture

Classic OOP inheritance, no modules/bundler — scripts are loaded via plain `<script>` tags in [index.html](index.html), so **load order matters** (base classes must be declared before subclasses).

```
DrawableObject → MovableObject → Character / Chicken / Chick / Endboss / ThrowableObject / Coin ...
```

### Key Classes ([models/](models/))

| Class                                                     | Responsibility                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `DrawableObject`                                          | Base class: image loading, drawing to canvas, debug hitbox frames               |
| `MovableObject`                                           | Adds movement, gravity, AABB/circle collision detection, animation helpers      |
| `Character`                                               | The player character (Pepe) — movement, jumping, throwing, animations           |
| `Chicken` / `Chick`                                       | Basic enemies with walk/dead animations                                         |
| `Endboss`                                                 | Multi-phase boss with alert/attack/hurt/dead states                             |
| `ThrowableObject`                                         | Thrown salsa bottles with rotation and splash animation                         |
| `Coin`                                                    | Collectible using circle-based collision detection                              |
| `Cloud` / `BackgroundObject`                              | Parallax scenery layers                                                         |
| `Healthbar` / `Coinbar` / `Salsabar` (extend `Statusbar`) | HUD status bars                                                                 |
| `Level`                                                   | Container for enemies, clouds, backgrounds, coins, and bottles for a level      |
| `World`                                                   | Central game controller: render loop, camera, collision & cleanup orchestration |
| `CollisionManager`                                        | Encapsulates collision checks between world entities                            |
| `CleanupManager`                                          | Removes defeated enemies / collected items from the world                       |
| `Keyboard`                                                | Simple input state object (boolean flags per key)                               |

### Game Loop

`World` renders via `requestAnimationFrame` and runs game logic (collisions, state checks) on a `setInterval`. Levels are plain instantiated objects (see [levels/level1.js](levels/level1.js)), not data-driven configs:

```js
new Level([enemies], [clouds], [backgrounds], [coins], [bottles]);
```

### Menu / Bootstrapping

[scripts/game.js](scripts/game.js) wires up the start screen, instructions, mute toggle (persisted via `localStorage`), mobile controls, and orientation warning, and creates the `World` on game start.

## Project Structure

```
index.html          Entry point — canvas, menus, script load order
style.css            All styling (menus, HUD, responsive/mobile controls)
scripts/game.js      Menu logic, input wiring, game bootstrapping
models/              Game entity classes (see table above)
levels/level1.js     Level 1 entity/layout definitions
img/                 Sprites, backgrounds, UI assets
audio/               Background music and sound effects
docs/                Generated JSDoc API documentation
```

## Documentation

API documentation for all classes is generated with JSDoc and available in [docs/index.html](docs/index.html).

## License

MIT — see [LICENSE](LICENSE).
