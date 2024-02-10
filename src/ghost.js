import changeSide from './changeSide.js'

export default class Ghost {
    constructor(game, position, color) {
        this.game = game;
        this.position = position;
        this.color = color;
        this.size = 30;
        this.speedX = 0;
        this.speedY = 0.1;
        this.lastDirectionChange = 0;
    }

    draw(ctx) {
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    getRandomSpeed() {
        let rolledSpeed = 0.1;

        if (Math.random() > 0.5) {
            rolledSpeed = -0.1;
        }

        return rolledSpeed;
    }

    setNewSpeed() {
        this.speedX = 0;
        this.speedY = 0;

        if (Math.random() > 0.5) {
            this.speedX = this.getRandomSpeed();
        } else {
            this.speedY = this.getRandomSpeed();
        }
    }

    isDirectionChangeTimePassed() {
        return new Date() - this.lastDirectionChange >= 3000;
    }

    collisionDetection(block, deltaTime) {
        if (this.position.x + this.speedX * deltaTime + this.size / 2 >= block.position.x
            && this.position.x + this.speedX * deltaTime - this.size / 2 <= block.position.x + block.size
            && this.position.y + this.speedY * deltaTime + this.size / 2 >= block.position.y
            && this.position.y + this.speedY * deltaTime - this.size / 2 <= block.position.y + block.size) {
            return true;
        }
    }

    update(deltaTime) {
        this.position = changeSide(this.game, this);

        let collisionDetected = false;

        //checking if speed is not 0 beacause of pac man dying 3 sec freeze
        if (this.isDirectionChangeTimePassed() && this.speedX != 0 && this.speedY != 0) {
            this.lastDirectionChange = new Date();
            this.setNewSpeed();
        }

        this.game.allBlocks.forEach(block => {
            if (this.collisionDetection(block, deltaTime)) {
                collisionDetected = true;
                this.setNewSpeed();
            }
        });

        if (!collisionDetected) {
            this.position.x = this.position.x + this.speedX * deltaTime;
            this.position.y = this.position.y + this.speedY * deltaTime;
        }
    }
}