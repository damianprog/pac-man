export default class Input {
    constructor(man, game) {
        this.man = man;
        this.game = game;
        document.addEventListener("keydown", event => {
            switch (event.key) {
                case "ArrowLeft":
                    this.man.moveLeft();
                    break;

                case "ArrowRight":
                    this.man.moveRight();
                    break;

                case "ArrowDown":
                    this.man.moveDown();
                    break;

                case "ArrowUp":
                    this.man.moveUp();
                    break;

                case ' ':
                    this.game.start();
                    break;
            }
        });
    }
}