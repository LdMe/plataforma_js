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


function preload() {
    // Carga los assets del juego (spritesheets, imágenes, etc.)
    this.load.image('background', 'assets/background.png');
    this.load.spritesheet('player', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('floor', 'assets/floor.png',{ frameWidth: 32, frameHeight: 32 });
    for (let i = 1; i <= maxLevel; i++) {
        this.load.image(`map${i}`, `assets/maps/map${i}.png`);
    }
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('star', 'assets/star.png');
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
}

function update() {
    if(ended){
        return;
    }
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

    if ((WKey.isDown || spacebar.isDown || cursors.up.isDown) && player.body.touching.down ) {
        player.setVelocityY(-330);
    }
}

// on restart button click, restart the game
document.getElementById('restart').addEventListener('click', function() {
    console.log("restart");
    game.scene.create();
});
