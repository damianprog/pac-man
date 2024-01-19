export default class Block {
    constructor(game, position) {
        this.game = game;
        this.position = position;
        this.size = 50;
    }

    update(deltaTime) {

    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#0000FF';
        ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }

}