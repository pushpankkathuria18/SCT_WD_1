//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//bird
let birdwidth = 34; //  width/height ratio = 408/220 = 17/22
let birdheight = 24;
let birdX = boardwidth / 8; // To position the bird X wise.
let birdY = boardheight / 2; // To position the bird Y wise.
let birdImg;

//bird object
let bird = {
  x: birdX,
  y: birdY,
  width: birdwidth,
  height: birdheight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //  width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed.
let velocityY = 0; //bird jump speed.
let gravity = 0.4;

let gameOver = false;
let gameStarted = false;
let score = 0;

let wingSound = new Audio("./sfx_wing.wav");
let hitSound = new Audio("./sfx_hit.wav");

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardheight;
  board.width = boardwidth;
  context = board.getContext("2d"); //used for drawing on the board.

  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  newGameBtn.style.display = "none"; // Ensure the button is hidden when the game starts

  requestAnimationFrame(update);
  setInterval(placePipes, 1500); //every 1.5 seconds placePipes function is called and it's going to add new pipe to our array.
  document.addEventListener("keydown", moveBird);
  document.addEventListener("click", moveBird);
  document.getElementById("newGameBtn").addEventListener("click", restartGame);
};

function update() {
  requestAnimationFrame(update);
  if (!gameStarted) {
    return; // Pause the game until user starts
  }
  if (gameOver) {
    newGameBtn.style.display = "block"; // Show button
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //bird
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas.
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }
  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes.
      pipe.passed = true;
    }
    if (detectCollision(bird, pipe)) {
      hitSound.play();
      gameOver = true;
    }
  }

  //clear pipes
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //removes first element from the array.
  }

  //score
  context.fillStyle = "White";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 50, 100);
  }
}

function placePipes() {
  if (gameOver || !gameStarted) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = boardheight / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (gameOver) {
    return; // Prevent movement after game over
  }

  if (!gameStarted) {
    gameStarted = true; // Start the game when user presses Spacebar or clicks
  }

  if (e.code == "Space" || e.code == "ArrowUp" || e.type == "click") {
    velocityY = -6;
  }
}

function restartGame() {
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
  gameStarted = false; // Keep game paused at the start
  velocityY = 0;
  newGameBtn.style.display = "none"; // Hide the button when the game restarts
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
