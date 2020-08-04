
//-------when we click on start button then display game board to play game--------
let home = document.getElementById("home");
let start = document.getElementById("play");
let boar = document.getElementById("board");
start.addEventListener('click', () => {
    console.log("thayu");
    home.style.display = "none";
    boar.style.display = "block";
})


//-----------auto set width of game board-------- 
let container = document.querySelector('.container');
let width = container.offsetWidth;
width = parseInt(width / 20);

// ------------set canvas height and width--------------
const canvas = document.getElementById("board");
canvas.width = 20 * width;
canvas.height = 20 * width;
const board = canvas.getContext('2d');

// --------global variables---------
let snake = [{ x: parseInt(width / 2) * 20, y: parseInt(width / 2) * 20 }];
    snake.append({ x: parseInt(width / 2) * 20+20, y: parseInt(width / 2) * 20+20 });
const box = 20;
let direction;
let score=0;
let maximumScore=window.localStorage.getItem("maxScore");
if(maximumScore=="NaN") maximumScore=0;
else{
    maximumScore=parseInt(maximumScore);
    document.getElementById("score").innerHTML=`${maximumScore}`;
}


// --------food-------
let food = {
    x: Math.floor(Math.random() * width) * box,
    y: Math.floor(Math.random() * width) * box
}

//--------load audio file-------
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "./audio/dead.mp3";
eat.src = "./audio/eat.mp3";
up.src = "./audio/up.mp3";
right.src = "./audio/right.mp3";
left.src = "./audio/left.mp3";
down.src = "./audio/down.mp3";



// -----------set direction--------------
document.addEventListener("keydown", (event) => {
    let key = event.keyCode;
    if (key == 37 && direction != "RIGHT") {
        direction = "LEFT";
        left.play();
    } else if (key == 38 && direction != "DOWN") {
        direction = "UP";
        up.play();
    } else if (key == 39 && direction != "LEFT") {
        direction = "RIGHT";
        right.play();
    } else if (key == 40 && direction != "UP") {
        direction = "DOWN";
        down.play();
    }
})


// ------draw snack function-------

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        board.fillStyle = (i == 0) ? "black" : "rgb(0, 255, 34)";
        board.fillRect(snake[i].x, snake[i].y, box, box);

        board.strokeStyle = "black";
        board.lineWidth = 1;
        board.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}


// -------when game is over-----
function over() {
    //set maximumscore and store in local storage
    window.localStorage.setItem("maxScore",maximumScore);
    document.getElementById("score").innerHTML=maximumScore;

    boar.style.display = 'none';
    home.style.display = 'block';
    //reload page
    location.reload();
}

//-----colloisions condition-----------
function coll(head) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == head.x && snake[i].y == head.y) { return true; }
    }
    return false;
}

let flag = true;
//var for head of snake
let head,headx,heady;

//draw function to graw game board
function draw() {
    board.clearRect(0, 0, width * box, width * box);
    //draw snake
    drawSnake();
    if (flag == true) {
        // draw food
        board.fillStyle = "red";
        board.fillRect(food.x, food.y, box, box);

        //head of snake
        headx = snake[0].x;
        heady = snake[0].y;


        //go ahead in given direction
        if (direction == 'UP') heady = heady - box;
        else if (direction == 'DOWN') heady = heady + box;
        else if (direction == 'LEFT') headx = headx - box;
        else if (direction == 'RIGHT') headx = headx + box;

        //if we have food on our head position
        if (food.x == headx && food.y == heady) {
            //change food position
            food = {
                x: Math.floor(Math.random() * width) * box,
                y: Math.floor(Math.random() * width) * box
            }
            //update score
            score+=5;
            if(maximumScore<score) {maximumScore=score;}
            document.getElementById("score").innerHTML=`${score}`;
            eat.play();
        }
        else {
            snake.pop();
        }

        head = { x: headx, y: heady };
    }
    //check for colloision or any game over condition
    if (headx < 0 || headx > (width - 1) * box || heady < 0 || heady > (width - 1) * box || coll(head)) {
        dead.play();
        flag = false;
        clearInterval(game);
        setTimeout(() => {
            over();
        }, 500);

    }

    //update sneck head
    if (flag == true) {
        snake.unshift(head);
    }
}

// -----call draw function--------- 
let game = setInterval(draw, 120);
