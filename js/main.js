import { Object, StaticObject, MovableObject } from './classes/object.js';
import { Character } from './classes/character.js';
import { SceneGenerator } from './classes/sceneGenerator.js';
const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);
let player,cursors,staticObject,platforms;
function preload() {
    // Carga los assets del juego (spritesheets, imágenes, etc.)
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('floor', 'assets/platform.png');
    this.load.image('map', 'assets/map.png');
    //this.load.image('platform', 'assets/platform.png');
}

function create() {
    // Crea los objetos del juego
    this.add.image(400, 300, 'background');
    const sceneGenerator = new SceneGenerator(this, 'map', 32);
    sceneGenerator.generate();
    platforms = this.physics.add.staticGroup();
    platforms.create(100, 568, 'floor').setScale(1).refreshBody();
    platforms.create(800, 568, 'floor').setScale(1).refreshBody();
    platforms.create(400, 808, 'floor').setScale(3).refreshBody();

    player = new Character(this, 100, 450, 'player');
    player.setBounce(0.2);
    staticObject = new MovableObject(this,400, 300, 'floor');
    staticObject.setScale(0.2)
    this.physics.add.collider(player, staticObject);
    //this.physics.add.collider(player, platforms);
    this.physics.add.collider(staticObject, platforms);
    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.anims.create({
    //     key: 'turn',
    //     frames: [{ key: 'player', frame: 4 }],
    //     frameRate: 20
    // });

    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    this.physics.add.collider(player, platforms);
}

function update() {
    // Lógica de actualización del juego
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}
