import { Character } from "./character.js";

export class Player extends Character {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        // add text with score to the scene
        this.scoreText = document.getElementById('score');
        this.lives = 3;
        // make it keep position in the center on scroll
        //this.scoreText.setScrollFactor(0);
        
    }

    moveLeft() {
        this.body.setVelocityX(-300);
        this.anims.play('left', true);
    }
    moveRight() {
        this.body.setVelocityX(300);
        this.anims.play('right', true);
    }
    stop() {
        this.body.setVelocityX(0);
        this.anims.play('turn');
    }
    collect(collectable) {
        this.score += collectable.points;
        collectable.destroy();
        console.log("character collected a star, score: " + this.score);
        this.scoreText.innerText= 'Score: ' + this.score;

    }
}
