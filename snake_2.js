// canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// further variables
const rows = 20;
const cols = 20;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;
let snake = [{x: 19, y: 5}];
let fastFood = {};
let bigFood = {};
let direction = 'LEFT';
let fastFoodCollected = false;
let bigFoodCollected = false;
let intervalSpeed;

// set original snake speed; reset when game over
const setSnakeSpeed = () => {
    clearInterval(interval);
    intervalSpeed = 400;
    interval = setInterval(gameLoop, intervalSpeed);
}

// make snake faster when fast food is collected
const speedUpSnake = () => {
    clearInterval(interval);
    // avoid snake speeding up to infinite speed
    if (intervalSpeed > 100) {
        intervalSpeed -= 25;
        interval = setInterval(gameLoop, intervalSpeed);
    } else {
        interval = setInterval(gameLoop, intervalSpeed);
    }
}

// place food fast -> grows the snake by one but makes the game faster
const placeFastFood = () => {
    const randomX = Math.floor(Math.random() * cols);
    const randomY = Math.floor(Math.random() * rows);
    // check if food is placed where the snake currently is; if so, repeat
    if (snake.find(part =>
        part.x === randomX && part.y === randomY)
    ) {
        placeFastFood();
    } else if (randomX === bigFood.x && randomY === bigFood.y) {
        placeFastFood();
    } else {
        fastFood = {x: randomX, y: randomY};
    }
}

// place food big -> grows the snake by two but doesn't make it move faster
const placeBigFood = () => {
    const randomX = Math.floor(Math.random() * cols);
    const randomY = Math.floor(Math.random() * rows);
    // check if food is placed where the snake currently is; if so, repeat
    if (snake.find(part =>
        part.x === randomX && part.y === randomY)
    ) {
        placeBigFood();
    } else if (randomX === fastFood.x && randomY === fastFood.y) {
        placeBigFood();
    } else {
        bigFood = {x: randomX, y: randomY};
    }
}

// add snake part
const addPart = (x, y) => {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

// get key input to move snake in a certain direction
const keyDown = (key) => {
    if (key.keyCode === 37) {
        direction = 'LEFT';
    } else if (key.keyCode === 38) {
        direction = 'UP';
    } else if (key.keyCode === 39) {
        direction = 'RIGHT';
    } else if (key.keyCode === 40) {
        direction = 'DOWN';
    }
}

// shift snake
const shiftSnake = () => {
    for (let i = snake.length - 1; i > 0; i--) {
        const lastPart = snake[i];
        const previousPart = snake[i - 1];
        lastPart.x = previousPart.x;
        lastPart.y = previousPart.y;
    }
}

// game over
const gameOver = () => {
    // exiting the game field or biting itself
    const snakeHead = snake[0];
    const snakeTail = snake.slice(1);
    const duplicate = snakeTail.find(part =>
        part.x === snakeHead.x && part.y === snakeHead.y
    );
    if (snake[0].x < 0 ||
        snake[0].x >= cols - 1 ||
        snake[0].y < 0 ||
        snake[0].y >= rows -1 ||
        duplicate) {
            snake = [{x: 19, y: 5}];
            placeFastFood();
            placeBigFood();
            direction = 'LEFT';
            setSnakeSpeed();
    }
}

// drawing the canvas
const draw = () => {
    // draw background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // draw snake
    ctx.fillStyle = 'white';
    snake.forEach(part => addPart(part.x, part.y));
    // draw food fast
    ctx.fillStyle = 'lightgreen';
    addPart(fastFood.x, fastFood.y);
    // draw food big
    ctx.fillStyle = 'yellow';
    addPart(bigFood.x, bigFood.y);

    // execute the function again after each screen repaint
    requestAnimationFrame(draw);
}

// game loop
const gameLoop = () => {
    // game over
    gameOver();
    // food collected
    if (fastFoodCollected) {
        snake = [{x: snake[0].x, y: snake[0].y}, ...snake];
        fastFoodCollected = false;
    } else if (bigFoodCollected) {
        snake = [{x: snake[0].x, y: snake[0].y}, {x: snake[0].x, y: snake[0].y}, ...snake];
        bigFoodCollected = false;
    } 
    // shift snake
    shiftSnake();
    // move snake in current direction
    if (direction === 'LEFT') {
        snake[0].x--;
    } else if (direction === 'UP') {
        snake[0].y--;
    } else if (direction === 'RIGHT') {
        snake[0].x++;
    } else if (direction === 'DOWN') {
        snake[0].y++;
    }
    // check if food is collected
    if (snake[0].x === fastFood.x && snake[0].y === fastFood.y) {
        // fastFoodCollected = tFastFood();
        fastFoodCollected = true;
        placeFastFood();
        // make snake faster
        speedUpSnake();
    } else if (snake[0].x === bigFood.x && snake[0].y === bigFood.y) {
        bigFoodCollected = true;
        placeBigFood();
    }
}

// add event listener
document.addEventListener('keydown', keyDown);

// call functions
let interval = setInterval(gameLoop, intervalSpeed);

draw();