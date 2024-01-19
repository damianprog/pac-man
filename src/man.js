import Position from './position.js'

export default class Man {
    constructor(game) {
        this.game = game;
        this.size = 40;
        this.speedX = 0;
        this.speedY = 0;
        this.position = new Position(100, 400);
        this.canMoveRight = true;
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.canMoveDown = true;
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFF00';
        ctx.fill();
    }

    update(deltaTime) {
        if (this.position.x > this.game.gameWidth + this.size / 2) {
            this.position.x = this.position.x - (this.game.gameWidth + this.size);
        }

        if (this.position.x < 0 - this.size / 2) {
            this.position.x = this.position.x + (this.game.gameWidth + this.size);
        }

        if (this.position.y < 0 - this.size / 2) {
            this.position.y = this.position.y + this.game.gameHeight + this.size;
        }

        if (this.position.y > this.game.gameHeight + this.size / 2) {
            this.position.y = this.position.y - (this.game.gameHeight + this.size);
        }



        this.game.allBlocks.forEach(block => {
            if (this.position.x + this.speedX * deltaTime + this.size / 2 >= block.position.x
                && this.position.x + this.speedX * deltaTime - this.size / 2 <= block.position.x + block.size
                && this.position.y + this.speedY * deltaTime + this.size / 2 >= block.position.y
                && this.position.y + this.speedY * deltaTime - this.size / 2 <= block.position.y + block.size) {
                this.speedX = 0;
                this.speedY = 0;
            } else {
                this.position.x = this.position.x + this.speedX * deltaTime;
                this.position.y = this.position.y + this.speedY * deltaTime;
            }
        });

    }

    moveLeft() {
        if (this.canMoveLeft) {
            this.speedY = 0;
            this.speedX = -0.2;
            this.canMoveRight = true;
        }
    }

    moveRight() {
        if (this.canMoveRight) {
            this.speedY = 0;
            this.speedX = 0.2;
            this.canMoveLeft = true;
        }
    }

    moveUp() {
        if (this.canMoveUp) {
            this.speedX = 0;
            this.speedY = -0.2;
            this.canMoveDown = true;
        }
    }

    moveDown() {
        if (this.canMoveDown) {
            this.speedX = 0;
            this.speedY = 0.2;
            this.canMoveUp = true;
        }

    }
}
