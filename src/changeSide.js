import Position from "./position.js";

export default (game, object) => {
    const newPosition = new Position(object.position.x, object.position.y);

    if (object.position.x > game.gameWidth + object.size / 2) {
        newPosition.x = object.position.x - (game.gameWidth + object.size);
    }

    if (object.position.x < 0 - object.size / 2) {
        newPosition.x = object.position.x + (game.gameWidth + object.size);
    }

    return newPosition;
}