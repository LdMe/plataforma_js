import { Avoidable } from "./avoidable.js";

export class Projectile extends Avoidable {
    constructor(scene, x, y, texture,owner=null) {
        super(scene, x, y, texture);
        this.avoidable = true;
        this.setScale(0.5, 0.5);
        this.owner = owner;
        this.isActive=true;
        // destroy in 10 seconds
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                this.destroy();
            },
            callbackScope: this
        });
    }
}
