import { StaticObject } from "./object.js";

export class Platform extends StaticObject {
    constructor(scene, x, y) {
        super(scene, x, y, "floor");
        // set random frame
        this.setFrame(Phaser.Math.Between(0, 3));
    }
}
