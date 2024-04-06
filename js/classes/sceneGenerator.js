import { Character } from './character.js';
import { StaticObject, MovableObject } from './object.js';
class SceneGenerator {
    constructor(scene, imageKey, tileSize) {
        this.scene = scene;
        this.imageKey = imageKey;
        this.tileSize = tileSize;
        this.texture = scene.textures.get(imageKey);
    }

    generate() {
        const bitmap = this.texture.getSourceImage();
        this.scene.platforms = this.scene.physics.add.staticGroup();
        this.scene.collectables = this.scene.physics.add.group();
        this.scene.characters = this.scene.physics.add.group();
        console.log("Generating scene from image: " + this.imageKey);
        console.log("Image size: " + bitmap.width + "x" + bitmap.height);
        console.log("Tile size: " + this.tileSize);
        console.log(bitmap);
        const canvas = this.scene.textures.createCanvas('canvas', bitmap.width, bitmap.height);
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
        console.log(imageData);

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
                    // Add more cases for other colors and object types
                }
            }
        }

        this.scene.physics.add.collider(this.scene.collectables, this.scene.platforms);
        this.scene.physics.add.collider(this.scene.collectables, this.scene.characters);
        this.scene.physics.add.collider(this.scene.characters, this.scene.platforms);
    }

    createPlatform(x, y) {
        console.log("Creating platform at: " + x + ", " + y);
        // create a static object at the specified position
        const newPlatform = new StaticObject(this.scene, x, y, 'floor');
        // add the platform to the platforms group
        this.scene.platforms.add(newPlatform);
    }

    createCollectable(x, y) {
        console.log("Creating collectable at: " + x + ", " + y);
        // Create a collectable object at the specified position
        const newCollectable = new MovableObject(this.scene, x, y, 'floor', false);
        newCollectable.setScale(0.2);
        newCollectable.setCollectable(true);
        this.scene.collectables.add(newCollectable);
    }

    createCharacter(x, y) {
        console.log("Creating character at: " + x + ", " + y);
        // Create a character object at the specified position
        const newCharacter = new Character(this.scene, x, y, 'player');
        this.scene.characters.add(newCharacter);
    }
}

export { SceneGenerator };