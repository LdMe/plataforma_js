import { MovableObject } from "./object.js";

export class Avoidable extends MovableObject {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.avoidable = true;
        // destroy in 10 seconds
        this.scene.time.addEvent({
            delay: 5000,
            callback: () => {
                this.destroy();
            },
            callbackScope: this
        });
    }
}
