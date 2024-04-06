// class object that will represent an object in the game. We are using phaser.

class Object extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
  }

  setDrag(x, y) {
    this.body.setDrag(x, y);
  }
  // Setter methods for breakable and collectable attributes
  setBreakable(value) {
    this.breakable = value;
  }

  setCollectable(value) {
    this.collectable = value;
  }
  
}


class StaticObject extends Object {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.body.setImmovable(true);
  }
}

class MovableObject extends Object {
  constructor(scene, x, y, texture, enableGravity = true) {
    super(scene, x, y, texture);
    this.body.setGravityY(enableGravity);
    this.body.setDrag(100, 0);
  }
}

export { Object, StaticObject, MovableObject };