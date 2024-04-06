// class object that will represent an object in the game. We are using phaser.

class Object extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setCollideWorldBounds(true);
    this.body.setBounce(0.2);
    this.body.setDrag(100, 0);
    // set pivot to bottom left
    this.setOrigin(0.5,0);
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
    // Setting immovable to true also prevents falling
    this.body.immovable= true;
    this.body.setAllowGravity(false);
  }
}

class MovableObject extends Object {
  constructor(scene, x, y, texture, enableGravity = true) {
    super(scene, x, y, texture);
    if(enableGravity) {
      this.body.setAllowGravity(true);
    }
    else {
      this.body.setAllowGravity(false);
    }
    
    
  }
  setVelocity(x, y) {
    this.body.setVelocity(x, y);
  }
}

export { Object, StaticObject, MovableObject };