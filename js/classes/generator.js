import { Avoidable } from "./avoidable.js";
import { StaticObject } from "./object.js";
// class generator that generates avoidables randomly from the generators position, with random velocity


export class Generator extends StaticObject{
    constructor(scene, x, y, texture,parent) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.parent = parent;
        // call update every second
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.update,
            callbackScope: this,
            loop: true
        });
    }
    generate() {
        console.log("generating bomb")
        this.parent.generateBomb(this.x, this.y);
        
    }
    // call generate every second if random number is 1
    update() {
        if (Phaser.Math.Between(0, 100) < 50) {
            const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.parent.player.x, this.parent.player.y);
            console.log("distance to player: " + distanceToPlayer);
            if (distanceToPlayer < 300) {
                this.generate();
            }
        }
    }
}