let userScore = 0;
let compScore = 0;
let gameOver = false; // Add a flag to track game state

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

const newBtn = document.querySelector("#new-game");

// Add event listeners to the choices
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    if (!gameOver) {
      const userChoice = choice.getAttribute("id");
      playGame(userChoice);
    }
  });
});

// Function to generate computer choice
const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return options[randomIndex];
};

// Function to handle a draw
const drawGame = () => {
  msg.innerText = `You choose "${userChoice}" & Computer chose "${compChoice}", Game was Draw, Play again.`;
  msg.style.backgroundColor = "#081b31";
};

// Function to show the winner of a round
const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    msg.innerText = `You chose "${userChoice}" & computer chose "${compChoice}", Your ${userChoice} beats ${compChoice} ,You Win!`;
    msg.style.backgroundColor = "green";
  } else {
    compScore++;
    compScorePara.innerText = compScore;
    msg.innerText = `Computer chose "${compChoice}" & You chose "${userChoice}", ${compChoice} beats Your ${userChoice} ,Computer Win!`;
    msg.style.backgroundColor = "red";
  }

  // Check if the game is over
  newgame();
};

// Function to play the game
const playGame = (userChoice) => {
  console.log("User choice = ", userChoice);
  const compChoice = genCompChoice();
  console.log("Comp choice = ", compChoice);

  if (userChoice === compChoice) {
    drawGame();
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      userWin = compChoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      userWin = compChoice === "scissors" ? false : true;
    } else {
      userWin = compChoice === "rock" ? false : true;
    }
    showWinner(userWin, userChoice, compChoice);
  }
};

// Function to end the game
const newgame = () => {
  if (userScore >= 3 || compScore >= 3) {
    gameOver = true; // Set gameOver flag to true
    if (userScore >= 3) {
      msg.innerText = "Player wins the match! Start a new game.";
      msg.style.backgroundColor = "green";
    } else if (compScore >= 3) {
      msg.innerText = "Computer wins the match! Start a new game.";
      msg.style.backgroundColor = "red";
    }
  }
};

// Function to reset the game
newBtn.addEventListener("click", () => {
  userScore = 0;
  compScore = 0;
  gameOver = false; // Reset the gameOver flag
  userScorePara.innerText = userScore;
  compScorePara.innerText = compScore;
  msg.innerText = "New Game Started. Make your choice!";
  msg.style.backgroundColor = "#081b31";
});
