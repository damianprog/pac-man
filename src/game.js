import Food from "./food.js";
import Input from "./input.js";
import Man from "./man.js";
import Position from "./position.js";
import Block from "./block.js";
import { Board } from "./board.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.man = new Man(this);
        this.input = new Input(this.man, this);
        this.allBlocks = [];
        this.allFood = [];
        this.initializeBlocks();
    }

    // initializeFood() {
    //     const allFood = [];
    //     let foodPosition = new Position(250, 300);
    //     allFood.push(new Food(this, foodPosition));
    //     return allFood;
    // }

    initializeBlocks() {
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

    // Board.forEach((piece,index) => {
    //     let row = index / 30;
    //     if (piece === 1) {
    //         allblocks.push(new Block(this, index))
    //     }
    // });
    // allBlocks.push(new Block(this, blockPosition));


    draw(ctx) {
        this.man.draw(ctx);
        this.allFood.forEach(food => food.draw(ctx));
        this.allBlocks.forEach(block => block.draw(ctx));
    }

    update(deltaTime) {
        this.man.update(deltaTime);
        this.allFood = this.allFood.filter(food => food.eaten === false);
        this.allFood.forEach(food => food.update(deltaTime, this.man));


    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}
