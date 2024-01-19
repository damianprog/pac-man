export default class Food {
    constructor(game, position) {
        this.game = game;
        this.position = position;
        this.size = 5;
        this.eaten = false;
    }

    update(deltaTime, man) {
        if (man.position.x + man.size / 2 > this.position.x - this.size / 2
            && man.position.x - man.size / 2 < this.position.x + this.size / 2
            && man.position.y + man.size / 2 > this.position.y - this.size / 2
            && man.position.y - man.size / 2 < this.position.y + this.size / 2) {
            this.eaten = true;
        }
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFF';
        ctx.fill();
    }

}