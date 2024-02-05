export default (deltaTime, object1, object2) => {
    if (object1.position.x + object1.speedX * deltaTime + object1.size / 2 >= object2.position.x
        && object1.position.x + object1.speedX * deltaTime - object1.size / 2 <= object2.position.x + object2.size
        && object1.position.y + object1.speedY * deltaTime + object1.size / 2 >= object2.position.y
        && object1.position.y + object1.speedY * deltaTime - object1.size / 2 <= object2.position.y + object2.size) {
        return true;
    }
    return false;
}