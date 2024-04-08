import { Object, StaticObject, MovableObject } from './classes/object.js';
import { Character } from './classes/character.js';
import { SceneGenerator } from './classes/sceneGenerator.js';
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: true
        }
    }
};

let game = new Phaser.Game(config);
let player;
let level=1;
const maxLevel = 2;
let ended=false;

function createControls(game) {
    // create control buttons for the game
    const leftButton = game.add.text(game.width - 100, 10, 'Left', { fontSize: '32px', fill: '#fff' });
    leftButton.setInteractive();
    leftButton.on('pointerdown', () => {
        player.moveLeft();
    });
    const rightButton = game.add.text(16, 16, 'Right', { fontSize: '32px', fill: '#fff' });
    rightButton.setInteractive();
    rightButton.on('pointerdown', () => {
        player.moveRight();
    });
    const upButton = game.add.text(16, 16, 'Up', { fontSize: '32px', fill: '#fff' });
    upButton.setInteractive();
    upButton.on('pointerdown', () => {
        player.jump();
    });
    leftButton.setScrollFactor(0);
    rightButton.setScrollFactor(0);
    upButton.setScrollFactor(0);
}
function preload() {
    // Carga los assets del juego (spritesheets, imágenes, etc.)
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/dude23.png', { frameWidth: 64, frameHeight: 96 });
    this.load.spritesheet('enemy', 'assets/dude24.png', { frameWidth: 64, frameHeight: 96 });
    this.load.spritesheet('floor', 'assets/floor.png',{ frameWidth: 32, frameHeight: 32 });
    for (let i = 1; i <= maxLevel; i++) {
        this.load.image(`map${i}`, `assets/maps/map${i}.png`);
    }
    this.load.image('bomb', 'assets/ball.png');
    this.load.image('copa', 'assets/copa2.png');

    this.load.image('projectile', 'assets/vaso.png');
    this.load.image('enemy-projectile', 'assets/sobrasada2.png');
    this.load.image('star', 'assets/bokata2.png');
    //this.load.image('platform', 'assets/platform.png');
}
function handleEndLevel(isWin){
    if(isWin){
        
        addLevel();
    }
    else{
        
    }
    game.scene.start();
    console.log("game",game)
}
function addLevel(){
    level++;
    if(level>maxLevel){
        alert("You win!");
        level=1;
        //game.scene.stop();
    }
    console.log("adding level: " + level);
}
function create() {
    // if(ended){
    //     console.log("Game ended, starting again");
    //     return;
    // }
    const background = this.add.image(400, 300, 'background');
    background.setScrollFactor(0);
    this.sceneGenerator = new SceneGenerator(this, 'map'+level, 32, handleEndLevel);
    const {platforms, collectables, characters,newPlayer} = this.sceneGenerator.generate();
    player = newPlayer;
    createControls(this);
}

function update() {
    if(ended){
        return;
    }
    // update each projectile of sceneGenerator
    this.sceneGenerator.characters.children.each(
        (character) => {
            character.update(this.sceneGenerator);
        }
    )
    // Lógica de actualización del juego
    const cursors = this.input.keyboard.createCursorKeys();
    const spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const randomNumber  = Phaser.Math.Between(0, 100);
    if( randomNumber < 1 ) {
        //this.sceneGenerator.generateBombs(1);
    }
    this.input.keyboard.addKeys('WASD');

    if (cursors.left.isDown || AKey.isDown ) {
        player.moveLeft();
    } else if (cursors.right.isDown || DKey.isDown) {
        player.moveRight();
    } else {
        player.stop();
    }
    if(spacebar.isDown) {
        player.shoot(this.sceneGenerator);
    }
    if ((WKey.isDown  || cursors.up.isDown) && player.body.touching.down ) {
        player.setVelocityY(-330);
    }
}

// on restart button click, restart the game
document.getElementById('restart').addEventListener('click', function() {
    console.log("restart");
    game.scene.create();
});
