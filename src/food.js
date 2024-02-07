import collisionDetection from "./collisionDetection.js";

export default class Food {
    constructor(game, position) {
        this.game = game;
        this.position = position;
        this.size = 5;
        this.eaten = false;
    }

    update(deltaTime) {

    }

    draw(ctx) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFF';
        ctx.fill();
    }

}