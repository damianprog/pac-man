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
        this.allBlocks = [];
        this.allFood = [];
        this.allGhosts = [];
        this.currentLevel = 1;
        this.currentLives = 3;
        this.currentScore = 0;
        this.man = new Man(this);
        this.initializeDefaults();
        this.initializeInfoPanels();
        this.input = new Input(this);
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
        this.levelInfoPanel = document.querySelector('.level-info-panel');
        this.pausedInfoPanel = document.querySelector('.paused-info-panel');
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
        this.man.setStartingPosition();
        this.initializeBoard();
        this.initializeGhosts();
        this.livesQty = document.querySelector('.lives-qty');
        this.scoreQty = document.querySelector('.score-qty');
        this.bestScoreQty = document.querySelector('.best-score-qty');
        this.gameOverScoreQty = document.querySelector('.game-over-score-qty');
        this.newBestScore = document.querySelector('.new-best-score');
        this.newBestScoreQty = document.querySelector('.new-best-score-qty');
        this.levelQty = document.querySelector('.level-qty');
        this.infoPanelLevelQty = document.querySelector('.info-panel-level-qty');
        this.localStorageBestScore = window.localStorage.getItem(
            'pacManBestScore'
        );
        this.levelQty.innerHTML = this.currentLevel;
        this.livesQty.innerHTML = this.currentLives;
        this.scoreQty.innerHTML = this.currentScore;
        this.setBestScore();
    }

    start() {
        if (
            this.gameState === GAME_STATE.WELCOME_MENU ||
            this.gameState === GAME_STATE.GAME_OVER ||
            this.gameState === GAME_STATE.LEVEL
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
            this.currentLives--;
            this.livesQty.innerHTML = this.currentLives;
            this.resolveGameOver();
            this.man.setStartingPosition();
            this.allGhosts = [];
            this.initializeGhosts();
        }, this.man.dyingDuration);
    }

    updateScores() {
        this.currentScore = this.currentScore + 10;
        this.scoreQty.innerHTML = this.currentScore + 10;
        this.setBestScore();
        this.resolveLevelUp();
    }

    resolveLevelUp() {
        if (this.allFood.length == 1) {
            this.currentLevel++;
            this.gameState = GAME_STATE.LEVEL;
            setTimeout(() => this.start(), 4000);
        }
    }

    resolveGameOver() {
        if (parseInt(this.livesQty.innerHTML) == 0) {
            this.currentLevel = 1;
            this.currentLives = 3;
            this.currentScore = 0;
            this.gameState = GAME_STATE.GAME_OVER;
        }
    }

    setBestScore() {
        let bestScore = this.localStorageBestScore ? this.localStorageBestScore : 0;
        if (parseInt(this.scoreQty.innerHTML) > bestScore) {
            bestScore = parseInt(this.scoreQty.innerHTML);
        }
        this.bestScoreQty.innerHTML = bestScore;
    }

    draw(ctx) {
        this.man.draw(ctx);
        this.allFood.forEach(food => food.draw(ctx));
        this.allBlocks.forEach(block => block.draw(ctx));
        this.allGhosts.forEach(ghost => ghost.draw(ctx));
    }

    pause() {
        if (this.gameState === GAME_STATE.RUNNING) {
            this.gameState = GAME_STATE.PAUSED;
        } else if (this.gameState === GAME_STATE.PAUSED) {
            this.gameState = GAME_STATE.RUNNING;
        }

    }

    update(deltaTime) {
        this.showInfo();

        if (this.gameState !== GAME_STATE.RUNNING) return;
        this.man.update(deltaTime);
        this.allFood = this.allFood.filter(food => food.eaten === false);
        this.allFood.forEach(food => food.update(deltaTime));
        this.allGhosts.forEach(ghost => ghost.update(deltaTime));
    }

    resolveNewBestScore() {
        const score = parseInt(this.scoreQty.innerHTML);
        if (score > parseInt(this.localStorageBestScore)) {
            this.newBestScore.style.display = 'block';
            this.newBestScoreQty.innerHTML = this.bestScoreQty.innerHTML;
            window.localStorage.setItem('pacManBestScore', score);
        } else {
            this.newBestScore.style.display = 'none';
        }
    }

    showInfo() {
        this.welcomeMenuInfoPanel.style.display = this.gameState === GAME_STATE.WELCOME_MENU ? 'block' : 'none';
        this.gameOverInfoPanel.style.display = this.gameState === GAME_STATE.GAME_OVER ? 'block' : 'none';
        this.levelInfoPanel.style.display = this.gameState === GAME_STATE.LEVEL ? 'block' : 'none';
        this.pausedInfoPanel.style.display = this.gameState === GAME_STATE.PAUSED ? 'block' : 'none';

        if (this.gameState === GAME_STATE.LEVEL) {
            this.infoPanelLevelQty.innerHTML = this.currentLevel;
        }
        if (this.gameState === GAME_STATE.GAME_OVER) {
            this.gameOverScoreQty.innerHTML = this.scoreQty.innerHTML;
            this.resolveNewBestScore();
        }
    }

    clear(ctx) {
        ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }
}