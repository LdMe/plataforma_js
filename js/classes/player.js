import { Character } from "./character.js";

export class Player extends Character {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        // add text with score to the scene
        this.scoreText = document.getElementById('score');
        this.lives = 3;
        this.reloadTime = 500;
        
    }

    moveLeft() {
        this.body.setVelocityX(-200);
        //flip the sprite
        this.flipX = true;
        this.anims.play('player-left', true);
    }
    moveRight() {
        this.body.setVelocityX(200);
        this.flipX = false;
        this.anims.play('player-right', true);
    }
    stop() {
        this.body.setVelocityX(0);
        this.anims.play('player-idle');
    }
    collect(collectable) {
        this.score += collectable.points;
        collectable.destroy();
        console.log("character collected a star, score: " + this.score);
        this.scoreText.innerText= 'Score: ' + this.score;

    }
}
