import { Character } from './character.js';
import { StaticObject, MovableObject } from './object.js';
import { Collectable } from './collectable.js';
import { Player } from './player.js';
import { Platform } from './platform.js';
import { Avoidable } from './avoidable.js';
import { Generator } from './generator.js';

class SceneGenerator {
    constructor(scene, imageKey, tileSize,onEnd ) {
        this.scene = scene;
        this.imageKey = imageKey;
        this.tileSize = tileSize;
        
        this.texture = scene.textures.get(imageKey);
        this.platforms = this.scene.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        this.generators = this.scene.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.collectables = this.scene.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.characters = this.scene.physics.add.group({
            dragX: 100,
            dragY: 0,
        });
        this.bombs = this.scene.physics.add.group({
            bounceX: 1,
        });
        this.onEnd = onEnd;
    }

    generate() {
        const bitmap = this.texture.getSourceImage();
        
        this.bounds = this.generateBounds(bitmap.width, bitmap.height);
        console.log("Generating scene from image: " + this.imageKey);
        console.log("Image size: " + bitmap.width + "x" + bitmap.height);
        console.log("Tile size: " + this.tileSize);
        console.log(bitmap);
        // first search if there is already a canvas
        this.canvas = this.scene.textures.createCanvas('canvas', bitmap.width, bitmap.height);
        const context = this.canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
        const data = imageData.data;
        for (let y = 0; y < bitmap.height; y++) {
            for (let x = 0; x < bitmap.width; x++) {
                const color = Phaser.Display.Color.GetColor(
                    data[(y * bitmap.width + x) * 4],
                    data[(y * bitmap.width + x) * 4 + 1],
                    data[(y * bitmap.width + x) * 4 + 2],
                    data[(y * bitmap.width + x) * 4 + 3]
                );

                const posX = x * this.tileSize;
                const posY = y * this.tileSize;

                switch (color) {
                    case 0x000000: // Black color for platforms
                        this.createPlatform(posX, posY);
                        break;
                    case 0x00ff00: // Green color for collectables
                        this.createCollectable(posX, posY);
                        break;
                    case 0xff0000: // Red color for characters
                        this.createCharacter(posX, posY);
                        break;
                    case 0xffaacc:
                        this.createPlayer(posX, posY);
                        break;
                    case 0xffee00:
                        this.createEnd(posX, posY);
                        break;
                    case 0xaabbcc:
                        this.createGenerator(posX, posY);
                        break;
                    // Add more cases for other colors and object types
                }
            }
        }
        console.log("Scene generated");
        console.log("adding colliders");
        this.scene.physics.add.collider(this.collectables, this.platforms);
        this.scene.physics.add.collider(this.collectables, this.collectables);
        this.scene.physics.add.collider(this.characters, this.platforms);
        this.scene.physics.add.collider(this.characters, this.bounds, (character, bounds) => {
            console.log(`Collision between ${character.texture.key} and  bounds ${bounds.texture.key}`);

        });
        this.scene.physics.add.overlap(this.player, this.collectables, (player, star) => {
            player.collect(star);
        });
        this.scene.physics.add.collider(this.player, this.bombs, (player, bomb) => {
            console.log("player collided with bomb");
            bomb.destroy();
            this.endGame(false);
        });
        this.scene.physics.add.collider(this.bombs, this.platforms);
        this.scene.physics.add.collider(this.player, this.characters);
        this.scene.physics.add.overlap(this.player, this.end, (player, end) => {
            console.log("player collided with end");
            this.endGame(true);

        });
        this.scene.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        return {
            platforms: this.platforms,
            collectables: this.collectables,
            characters: this.characters,
            newPlayer: this.player
        }
    }

    createPlatform(x, y) {
        const totalX = x;
        const totalY = y;
        // create a static object at the specified position
        const platform = new Platform(this.scene, totalX, totalY);
        this.platforms.add(platform);
    }
    //create a point where the player must arrive
    createEnd(x, y) {
        const totalX = x;
        const totalY = y;
        console.log("Creating endsssssssssss at: " + totalX + ", " + totalY);
        // create a static object at the specified position
        this.end = this.scene.physics.add.staticImage(totalX, totalY, 'bomb');
    }

    createGenerator(x, y) {
        const totalX = x;
        const totalY = y;
        console.log("Creating generator at: " + totalX + ", " + totalY);
        // create a static object at the specified position
        const generator = new  Generator(this.scene, totalX, totalY, 'generator',this);
        this.generators.add(generator);
    }
    // add a method to generate bounds the bounds must be static colliders with the size of the image
    generateBounds(width, height) {
        const bounds = this.scene.physics.add.staticGroup();
        // Vertical lines
        for (let x = 0; x <= width * this.tileSize; x += this.tileSize) {
            bounds.create(x, 0, 2, height * this.tileSize, 0x000000);
        }
        // Horizontal lines
        for (let y = 0; y <= height * this.tileSize; y += this.tileSize) {
            bounds.create(0, y, width * this.tileSize, 2, 0x000000);
        }
        // Final vertical line
        for (let x = 0; x <= width * this.tileSize; x += this.tileSize) {
            bounds.create(x, height * this.tileSize, 2, height * this.tileSize, 0x000000);
        }
        // Final horizontal line
        for (let y = 0; y <= height * this.tileSize; y += this.tileSize) {
            bounds.create(width * this.tileSize, y, width * this.tileSize, 2, 0x000000);
        }
        console.log("bounds generated", bounds);
        return bounds;
    }
    createCollectable(x, y) {
        const totalX = x;
        const totalY = y;
        // Create a collectable object at the specified position
        const newCollectable = new Collectable(this.scene, totalX, totalY, 'star', 2);
        newCollectable.setScale(0.8);
        newCollectable.setCollectable(true);
        this.collectables.add(newCollectable);
    }

    createCharacter(x, y) {
        const totalX = x;
        const totalY = y;
        console.log("Creating character at: " + totalX + ", " + totalY);
        // Create a character object at the specified position
        const newCharacter = new Character(this.scene, totalX, totalY, 'player');
        this.characters.add(newCharacter);
    }

    createPlayer(x, y) {
        const totalX = x;
        const totalY = y;
        console.log("Creating player at: " + totalX + ", " + totalY);
        // Create a character object at the specified position
        const newCharacter = new Player(this.scene, totalX, totalY, 'player');
        newCharacter.setBounce(0.2);
        this.player = newCharacter;
        this.characters.add(newCharacter);
    }
    // function that ends the game, shows points and asks to start again
    endGame(wins=false) {
        console.log("Game ended");
        //restart game
        //delete this canvas
        this.scene.textures.remove('canvas');
        this.onEnd(wins);
        this.scene.scene.start();
    }
    generateBomb(x,y) {
        // generate n bombs above player and with random horizontal velocity
        const bomb = new Avoidable(this.scene, x, y, 'bomb');
        this.bombs.add(bomb);
        let vx = Phaser.Math.Between(30, 100);
        vx = Math.random() < 0.5 ? vx : -vx;
        
        bomb.setVelocity(vx, 0);

    }
}

export { SceneGenerator };