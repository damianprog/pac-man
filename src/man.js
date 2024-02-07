import Position from './position.js'
import changeSide from './changeSide.js';
import collisionDetection from './collisionDetection.js';

export default class Man {
    constructor(game) {
        this.game = game;
        this.size = 30;
        this.speedX = 0;
        this.speedY = 0;
        this.setStartingPosition();
    }

    setStartingPosition() {
        this.position = new Position(300, 291);
    }

    checkCollisionWithBlocks(deltaTime) {
        this.game.allBlocks.forEach(block => {
            if (collisionDetection(deltaTime, this, block)) {
                this.speedX = 0;
                this.speedY = 0;
            }
        });
    }

    checkCollisionWithFood(deltaTime) {
        this.game.allFood.forEach(food => {
            if (collisionDetection(deltaTime, this, food)) {
                food.eaten = true;
            }
        });
    }

    checkCollisionWithGhosts(deltaTime) {
        this.game.allGhosts.forEach(ghost => {
            if (collisionDetection(deltaTime, this, ghost)) {
                this.game.onGhostCollision();
            }
        });
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFF00';
        ctx.fill();
    }

    update(deltaTime) {
        this.position = changeSide(this.game, this);

        this.checkCollisionWithBlocks(deltaTime);

        this.checkCollisionWithFood(deltaTime);

        this.checkCollisionWithGhosts(deltaTime);

        this.position.x = this.position.x + this.speedX * deltaTime;
        this.position.y = this.position.y + this.speedY * deltaTime;

    }

    moveLeft() {
        this.speedY = 0;
        this.speedX = -0.1;
    }

    moveRight() {
        this.speedY = 0;
        this.speedX = 0.1;
    }

    moveUp() {
        this.speedX = 0;
        this.speedY = -0.1;
    }

    moveDown() {
        this.speedX = 0;
        this.speedY = 0.1;

    }
}
