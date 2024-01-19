import Food from "./food.js";
import Input from "./input.js";
import Man from "./man.js";
import Position from "./position.js";
import Block from "./block.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.man = new Man(this);
        this.input = new Input(this.man, this);
        this.allFood = this.initializeFood();
        this.allBlocks = this.initializeBlocks();
    }

    initializeFood() {
        const allFood = [];
        let foodPosition = new Position(350, 350);
        allFood.push(new Food(this, foodPosition));
        return allFood;
    }

    initializeBlocks() {
        const allBlocks = [];
        let blockPosition = new Position(100, 100);
        // let blockPosition2 = new Position(150, 100);
        allBlocks.push(new Block(this, blockPosition));
        // allBlocks.push(new Block(this, blockPosition2));
        return allBlocks;
    }

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
