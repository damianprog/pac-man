import Position from './position.js'
import changeSide from './changeSide.js';

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

    collisionDetection(object, objectPosition, deltaTime) {
        let objectSpeedX = object.speedX ? object.speedX * deltaTime : 0;
        let objectSpeedY = object.speedY ? object.speedY * deltaTime : 0;

        if (this.position.x + this.speedX * deltaTime + this.size / 2 >= objectPosition.x + objectSpeedX
            && this.position.x + this.speedX * deltaTime - this.size / 2 <= objectPosition.x + objectSpeedX + object.size
            && this.position.y + this.speedY * deltaTime + this.size / 2 >= objectPosition.y + objectSpeedY
            && this.position.y + this.speedY * deltaTime - this.size / 2 <= objectPosition.y + objectSpeedY + object.size) {
            return true;
        }
    }

    checkCollisionWithBlocks(deltaTime) {
        this.game.allBlocks.forEach(block => {
            if (this.collisionDetection(block, block.position, deltaTime)) {
                this.speedX = 0;
                this.speedY = 0;
            }
        });
    }

    checkCollisionWithFood(deltaTime) {
        this.game.allFood.forEach(food => {
            const foodPosition = new Position(food.position.x - food.size / 2, food.position.y - food.size / 2);
            if (this.collisionDetection(food, foodPosition, deltaTime)) {
                food.eaten = true;
            }
        });
    }

    checkCollisionWithGhosts(deltaTime) {
        this.game.allGhosts.forEach(ghost => {
            const ghostPosition = new Position(ghost.position.x - ghost.size / 2, ghost.position.y - ghost.size / 2);
            if (this.collisionDetection(ghost, ghostPosition, deltaTime)) {
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
