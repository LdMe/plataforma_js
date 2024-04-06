

class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.texture = texture;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.scene.physics.add.collider(this, this.scene.platforms);
        this.createAnimations();
    }
    createAnimations() {
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers(this.texture, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'turn',
            frames: [{ key: this.texture, frame: 4 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers(this.texture, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }
    setBounce(value) {
        this.body.setBounceY(value);
    }
    setDrag(x, y) {
        this.body.setDrag(x, y);
    }
    setVelocity(x, y) {
        this.body.setVelocity(x, y);
    }
    setVelocityX(x) {
        this.body.setVelocityX(x);
    }
    setVelocityY(y) {
        this.body.setVelocityY(y);
    }
    setScale(x, y) {
        this.body.setScale(x, y);
    }
    setScale(x) {
        this.body.setScale(x);
    }
}

export { Character };