import Food from "./food.js";
import Input from "./input.js";
import Man from "./man.js";
import Position from "./position.js";
import Block from "./block.js";
import { Board } from "./board.js";
import Ghost from "./ghost.js";
import { GAME_STATE } from "./game-states.js";

export default class Game {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gameState = GAME_STATE.WELCOME_MENU;
        this.man = new Man(this);
        this.input = new Input(this.man, this);
        this.allBlocks = [];
        this.allFood = [];
        this.allGhosts = [];
        this.initializeDefaults();
        this.initializeInfoPanels();
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

    initializeInfoPanels() {
        this.gameOverInfoPanel = document.querySelector('.game-over-info-panel');
        this.welcomeMenuInfoPanel = document.querySelector('.welcome-menu-info-panel');
    }

    initializeGhosts() {
        this.allGhosts = [];
        const ghost1 = new Ghost(this, new Position(110, 290), '#ff0000');
        const ghost2 = new Ghost(this, new Position(300, 50), '#1b6914');
        const ghost3 = new Ghost(this, new Position(493, 290), '#800080');

        this.allGhosts.push(ghost1);
        this.allGhosts.push(ghost2);
        this.allGhosts.push(ghost3);
    }

    initializeDefaults() {
        this.initializeBoard();
        this.initializeGhosts();
        this.livesQty = document.querySelector('.lives-qty');
        this.scoreQty = document.querySelector('.score-qty');
        this.bestScoreQty = document.querySelector('.best-score-qty');
        this.gameOverScoreQty = document.querySelector('.game-over-score-qty');
        this.newBestScore = document.querySelector('.new-best-score');
        this.newBestScoreQty = document.querySelector('.new-best-score-qty');
        this.localStorageBestScore = window.localStorage.getItem(
            'pacManBestScore'
        );
        this.livesQty.innerHTML = 1;
        this.scoreQty.innerHTML = 0;
        this.setBestScore();
    }

    start() {
        if (
            this.gameState === GAME_STATE.WELCOME_MENU ||
            this.gameState === GAME_STATE.GAME_OVER
        ) {
            this.initializeDefaults();
            this.gameState = GAME_STATE.RUNNING;
        }
    }

    onGhostCollision() {
        this.man.speedX = 0;
        this.man.speedY = 0;

        this.allGhosts.forEach(ghost => {
            ghost.speedX = 0;
            ghost.speedY = 0;
        });

        setTimeout(() => {
            const livesQty = parseInt(this.livesQty.innerHTML) - 1;
            this.livesQty.innerHTML = livesQty;
            this.resolveGameOver();
            this.man.setStartingPosition();
            this.allGhosts = [];
            this.initializeGhosts();
        }, this.man.dyingDuration);
    }

    updateScores() {
        this.scoreQty.innerHTML = parseInt(this.scoreQty.innerHTML) + 10;
        this.setBestScore();
    }

    resolveGameOver() {
        if (parseInt(this.livesQty.innerHTML) == 0) {
            this.gameState = GAME_STATE.GAME_OVER;
        }
    }

    setBestScore() {
        let bestScore = this.localStorageBestScore ? this.localStorageBestScore : 0;
        if (parseInt(this.scoreQty.innerHTML) > bestScore) {
            bestScore = parseInt(this.scoreQty.innerHTML);
        }
        window.localStorage.setItem('pacManBestScore', bestScore);
        this.bestScoreQty.innerHTML = bestScore;
    }

    draw(ctx) {
        this.man.draw(ctx);
        this.allFood.forEach(food => food.draw(ctx));
        this.allBlocks.forEach(block => block.draw(ctx));
        this.allGhosts.forEach(ghost => ghost.draw(ctx));
    }

    update(deltaTime) {
        this.showInfo();
        if (this.gameState !== GAME_STATE.RUNNING) return;
        this.man.update(deltaTime);
        this.allFood = this.allFood.filter(food => food.eaten === false);
        this.allFood.forEach(food => food.update(deltaTime));
        this.allGhosts.forEach(ghost => ghost.update(deltaTime));
    }

    showInfo() {
        this.welcomeMenuInfoPanel.style.display = this.gameState === GAME_STATE.WELCOME_MENU ? 'block' : 'none';
        this.gameOverInfoPanel.style.display = this.gameState === GAME_STATE.GAME_OVER ? 'block' : 'none';
        if (this.gameState === GAME_STATE.GAME_OVER) {
            this.gameOverScoreQty.innerHTML = this.scoreQty.innerHTML;
            if (parseInt(this.scoreQty.innerHTML) < parseInt(this.localStorageBestScore.innerHTML)) {
                this.newBestScore.style.display = 'block';
                this.newBestScoreQty.innerHTML = this.bestScoreQty.innerHTML;
            }
        }
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}