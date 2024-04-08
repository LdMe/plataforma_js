import {Projectile} from './projectile.js';

class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.texture = texture;
        this.scene = scene;
        this.score=0;
        this.lives = 1;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.createAnimations();
        this.anims.play(texture+'-turn');
        this.reloadTimer = 0;
        this.reloadTime = 1000;

    }
    createAnimations() {
        this.scene.anims.create({
            key: this.texture+'-idle',
            frames: [{ key: this.texture, frame: 0 }],
            frameRate: 20
        });
        this.scene.anims.create({
            key: this.texture+'-right',
            frames: this.scene.anims.generateFrameNumbers(this.texture, { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        const leftAnimation = this.scene.anims.create({
            key: this.texture+'-left',
            frames: this.scene.anims.generateFrameNumbers(this.texture, { start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        // if left animation is playing, flip the sprite
        
    }
    shoot(game) {
        const now = Date.now();
        if( now < this.reloadTimer) {
            return;
        }
        const direction = this.flipX ? -1 : 1;
        const x = this.x + 16 * direction;
        const y = this.y;
        let newProjectile;
        if(this === game.player) {
            newProjectile = new Projectile(this.scene, x, y, 'projectile', this);
        }
        else {
            newProjectile = new Projectile(this.scene, x, y, 'enemy-projectile', this);
        }
        game.projectiles.add(newProjectile);
        let vx = 250 * direction;
        let vy = -150;
        newProjectile.setVelocity(vx, vy);
        this.reloadTimer = Date.now() + this.reloadTime;

    }
    update(game) {
        if(this === game.player) {
            return;
        }
        // aim at the player
        const distanceX = this.x - game.player.x;
        const distanceY = this.y - game.player.y;
        if(distanceX > 0) {
            this.flipX = true;
        }
        else {
            this.flipX = false;
        }
        if(Math.abs(distanceX) < 200 && Math.abs(distanceY) < 200) {
            if(Math.random() < 0.3) {
                this.shoot(game);
            }
        }
    }
    setBounce(value) {
        this.body.setBounceY(value);
    }
    setDrag(x, y) {
        this.body.setDrag(x, y);
    }
    setVelocity(x, y) {
        this.body.setVelocity(x, y);
    }
    setVelocityX(x) {
        this.body.setVelocityX(x);
    }
    setVelocityY(y) {
        this.body.setVelocityY(y);
    }
    
    
}

export { Character };