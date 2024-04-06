import { StaticObject } from "./object.js";

class Collectable extends StaticObject {
    constructor(scene, x, y, texture,points=1) {
        super(scene, x, y, texture);
        this.collectable = true;
        this.points = points;
    }
}

export { Collectable }
