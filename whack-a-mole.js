// Game state variables
let currentMoletile;
let currentPlantTile;
let score = 0;
let gameOver = false;
let moleInterval, plantInterval;

// Runs when the page loads
window.onload = function () {
  setupBoard(); // Show pipes before the game starts
  document.getElementById("startGameBtn").addEventListener("click", startGame);
  document.getElementById("newGameBtn").addEventListener("click", resetGame);
  document.getElementById("newGameBtn").style.display = "none"; // Hide "New Game" button initially
};

// Function to create the board with pipes BEFORE the game starts
function setupBoard() {
  let board = document.getElementById("board");
  board.innerHTML = ""; // Ensure board is empty before adding pipes

  // Create 3x3 grid with pipes
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();

    // Add pipe image to each tile before the game starts
    let pipe = document.createElement("img");
    pipe.src = "./pipe.png";
    pipe.classList.add("pipe"); // Add a class for styling if needed

    board.appendChild(tile); // Add tile to the board
  }
}

// Function to start the game
function startGame() {
  document.getElementById("startGameBtn").style.display = "none"; // Hide "Start Game" button
  document.getElementById("newGameBtn").style.display = "block"; // Show "New Game" button
  setGame(); // Start game logic
}

// Function to start the game logic
function setGame() {
  let board = document.getElementById("board");

  // Clear board and reset tiles for game
  board.innerHTML = ""; // Remove pipes before starting game

  // Create a 3x3 grid without pipes
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString();
    tile.addEventListener("click", selectTile); // Add event listener to each tile
    board.appendChild(tile); // Add tile to the board
  }

  // Reset game variables
  gameOver = false;
  score = 0;
  document.getElementById("score").innerText = "Score: " + score; // Display score

  // Set intervals for spawning mole and plant
  moleInterval = setInterval(setMole, 1000);
  plantInterval = setInterval(setPlant, 1000);
}

// Function to get a random tile ID
function getRandomTile() {
  return Math.floor(Math.random() * 9).toString();
}

// Function to spawn a mole
function setMole() {
  if (gameOver) return;

  if (currentMoletile) currentMoletile.innerHTML = ""; // Remove previous mole

  let mole = document.createElement("img");
  mole.src = "./monty-mole.png";

  let num = getRandomTile();
  if (currentPlantTile && currentPlantTile.id === num) return;

  currentMoletile = document.getElementById(num);
  currentMoletile.appendChild(mole);
}

// Function to spawn a plant
function setPlant() {
  if (gameOver) return;

  if (currentPlantTile) currentPlantTile.innerHTML = ""; // Remove previous plant

  let plant = document.createElement("img");
  plant.src = "./piranha-plant.png";

  let num = getRandomTile();
  if (currentMoletile && currentMoletile.id === num) return;

  currentPlantTile = document.getElementById(num);
  currentPlantTile.appendChild(plant);
}

// Function to handle tile selection
function selectTile() {
  if (gameOver) return;

  if (this === currentMoletile) {
    score += 10;
    document.getElementById("score").innerText = "Score: " + score;
  } else if (this === currentPlantTile) {
    document.getElementById("score").innerText = "GAME OVER: " + score;
    gameOver = true;
  }
}

// Function to reset the game
function resetGame() {
  clearInterval(moleInterval); // Stop mole spawning
  clearInterval(plantInterval); // Stop plant spawning

  // Reset the score to 0 and update the displayed score
  score = 0;
  document.getElementById("score").innerText = "Score: " + score;

  document.getElementById("newGameBtn").style.display = "none"; // Hide "New Game" button
  document.getElementById("startGameBtn").style.display = "block"; // Show "Start Game" button

  setupBoard(); // Reset board with pipes before restarting
}

// Create hammer element
let hammer = document.createElement("img");
// hammer.src = "./hammer.jpg"; // Ensure hammer.png is in the same directory
hammer.id = "hammer";
hammer.style.position = "absolute";
hammer.style.width = "90px"; // Adjust size as needed
hammer.style.pointerEvents = "none"; // Prevent blocking clicks
hammer.style.display = "none"; // Initially hidden
document.body.appendChild(hammer);

// Track mouse movement and show hammer only inside board
document.addEventListener("mousemove", (event) => {
  let board = document.getElementById("board");
  let boardRect = board.getBoundingClientRect(); // Get board position

  // Check if cursor is inside board
  if (
    event.clientX >= boardRect.left &&
    event.clientX <= boardRect.right &&
    event.clientY >= boardRect.top &&
    event.clientY <= boardRect.bottom
  ) {
    hammer.style.display = "block"; // Show hammer
    document.body.style.cursor = "none"; // Hide normal cursor
    hammer.style.left = event.clientX - 45 + "px"; // Adjust hammer position
    hammer.style.top = event.clientY - 45 + "px";
  } else {
    hammer.style.display = "none"; // Hide hammer
    document.body.style.cursor = "default"; // Restore normal cursor
  }
});

// Hammer animation when clicking
document.addEventListener("mousedown", () => {
  hammer.style.transform = "rotate(0deg) scale(1.1)"; // Click effect
});

document.addEventListener("mouseup", () => {
  hammer.style.transform = "rotate(-40deg) scale(1)"; // Reset position
});

