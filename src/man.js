import Position from './position.js'
import changeSide from './changeSide.js';
import collisionDetection from './collisionDetection.js';

export default class Man {
    constructor(game) {
        this.game = game;
        this.size = 30;
        this.speedX = 0;
        this.speedY = 0;
        this.movingDirections = {
            up: 'up',
            down: 'down',
            left: 'left',
            right: 'right'
        };
        this.isDying = false;
        this.showMan = true;
        this.dyingDuration = 3000;
        this.setStartingPosition();
    }

    setStartingPosition() {
        this.position = new Position(300, 291);
        this.currentMovingDirection = this.movingDirections.right;
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

    startDying() {
        this.isDying = true;

        const toggleShowManInterval = setInterval(() => {
            this.showMan = !this.showMan;
        }, 200);

        setTimeout(() => {
            clearInterval(toggleShowManInterval);
            this.showMan = true;
            this.isDying = false;
        }, this.dyingDuration);
    }

    checkCollisionWithGhosts(deltaTime) {
        this.game.allGhosts.forEach(ghost => {
            if (collisionDetection(deltaTime, this, ghost)) {
                this.startDying();
                this.game.onGhostCollision();
            }
        });
    }

    getCurrentMovingDirectionAngle() {
        switch (this.currentMovingDirection) {
            case 'right':
                return 0;
            case 'down':
                return 90;
            case 'left':
                return 180;
            case 'up':
                return 266;
        }
    }

    draw(ctx) {
        if (this.showMan) {
            ctx.save();
            ctx.translate(this.position.x, this.position.y);
            ctx.rotate((this.getCurrentMovingDirectionAngle() * Math.PI) / 180);
            ctx.translate(this.position.x * -1, this.position.y * -1);

            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.size / 2, 0.25 * Math.PI, 1.25 * Math.PI, false);
            ctx.fillStyle = "#FFFF00";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.size / 2, 0.75 * Math.PI, 1.75 * Math.PI, false);
            ctx.fill();

            ctx.restore();
        }
    }

    update(deltaTime) {
        this.position = changeSide(this.game, this);

        this.checkCollisionWithBlocks(deltaTime);

        this.checkCollisionWithFood(deltaTime);

        if (!this.isDying) {
            this.checkCollisionWithGhosts(deltaTime);
        }

        this.position.x = this.position.x + this.speedX * deltaTime;
        this.position.y = this.position.y + this.speedY * deltaTime;

    }

    moveLeft() {
        if (!this.isDying) {
            this.speedY = 0;
            this.speedX = -0.1;
            this.currentMovingDirection = this.movingDirections.left;
        }
    }

    moveRight() {
        if (!this.isDying) {
            this.speedY = 0;
            this.speedX = 0.1;
            this.currentMovingDirection = this.movingDirections.right;
        }
    }

    moveUp() {
        if (!this.isDying) {
            this.speedX = 0;
            this.speedY = -0.1;
            this.currentMovingDirection = this.movingDirections.up;
        }
    }

    moveDown() {
        if (!this.isDying) {
            this.speedX = 0;
            this.speedY = 0.1;
            this.currentMovingDirection = this.movingDirections.down;
        }
    }
}
