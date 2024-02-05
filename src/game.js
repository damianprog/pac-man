import Food from "./food.js";
import Input from "./input.js";
import Man from "./man.js";
import Position from "./position.js";
import Block from "./block.js";
import { Board } from "./board.js";
import Ghost from "./ghost.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.man = new Man(this);
        this.input = new Input(this.man, this);
        this.allBlocks = [];
        this.allFood = [];
        this.allGhosts = [];
        this.initializeBoard();
        this.initializeGhosts();
    }

    initializeBoard() {
        const allBlocks = [];
        const allFood = [];
        let currentIndex = 0;
        for (let row = 0; row < 30; row++) {

            for (let col = 0; col < 30; col++) {
                if (Board[currentIndex] === 1) {
                    allBlocks.push(new Block(this, new Position(col * 20, row * 20)));
                } else if (Board[currentIndex] === 2) {
                    allFood.push(new Food(this, new Position((col * 20) + 9.5, (row * 20) + 9.5)));
                }
                currentIndex++;
            }

        }

        this.allBlocks = allBlocks;
        this.allFood = allFood;
    }

    initializeGhosts() {
        const ghost1 = new Ghost(this, new Position(350, 291), '#ff0000');
        const ghost2 = new Ghost(this, new Position(172, 291), '#1b6914');
        const ghost3 = new Ghost(this, new Position(430, 291), '#800080');

        this.allGhosts.push(ghost1);
        this.allGhosts.push(ghost2);
        this.allGhosts.push(ghost3);
    }

    draw(ctx) {
        this.man.draw(ctx);
        this.allFood.forEach(food => food.draw(ctx));
        this.allBlocks.forEach(block => block.draw(ctx));
        this.allGhosts.forEach(ghost => ghost.draw(ctx));
    }

    update(deltaTime) {
        this.man.update(deltaTime);
        this.allFood = this.allFood.filter(food => food.eaten === false);
        this.allFood.forEach(food => food.update(deltaTime, this.man));
        this.allGhosts.forEach(ghost => ghost.update(deltaTime));
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}
