function TicTacToe(placeholder, grid_size, callback) {
  this.placeholder = placeholder;
  this.paint(grid_size);
  this.callback = callback;
  this.scores = { X: 0, O: 0 };
  this.marks = { X: "X", O: "O", count: 0 };
  return this;
}

TicTacToe.prototype.paint = function (grid_size) {
  var self = this;
  self.grid_size = grid_size;

  var html = '<table id="tic-tac-toe" align="center">';
  for (var i = 0; i < grid_size; i++) {
    html += "<tr>";
    for (var j = 0; j < grid_size; j++) {
      html += "<td></td>";
    }
    html += "</tr>";
  }
  html += "</table>";

  self.placeholder.innerHTML = html;
  self.columns = self.placeholder.getElementsByTagName("td");

  for (i = 0; i < this.columns.length; i++) {
    self.columns[i].addEventListener("click", markHandler);
  }

  function markHandler(e) {
    self.mark(e.target);
  }
};

TicTacToe.prototype.mark = function (column) {
  if (column.innerHTML) return;

  this.marks.count++;
  var current_mark = this.marks.count % 2 === 1 ? this.marks.X : this.marks.O;

  column.innerHTML = current_mark;
  column.classList.add(current_mark);

  if (this.didWin(current_mark)) {
    if (current_mark === this.marks.X) {
      this.scores.X++;
    } else {
      this.scores.O++;
    }
    this.callback(current_mark, this.scores);
  } else if (this.marks.count === this.columns.length) {
    this.callback("draw");
  }
};

TicTacToe.prototype.didWin = function (mark) {
  var grid_size = this.grid_size;
  var horizontal_count,
    vertical_count,
    right_to_left_count = 0,
    left_to_right_count = 0;

  for (var i = 0; i < grid_size; i++) {
    horizontal_count = vertical_count = 0;

    for (var j = 0; j < grid_size; j++) {
      if (this.columns[i * grid_size + j].innerHTML == mark) horizontal_count++;
      if (this.columns[j * grid_size + i].innerHTML == mark) vertical_count++;
    }
    if (horizontal_count == grid_size || vertical_count == grid_size)
      return true;

    if (this.columns[i * grid_size + i].innerHTML == mark)
      right_to_left_count++;
    if (this.columns[(grid_size - 1) * (i + 1)].innerHTML == mark)
      left_to_right_count++;
  }

  if (right_to_left_count == grid_size || left_to_right_count == grid_size)
    return true;
  return false;
};

TicTacToe.prototype.empty = function () {
  for (var i = 0; i < this.columns.length; i++) {
    this.columns[i].innerHTML = "";
    this.columns[i].classList.remove(this.marks.X);
    this.columns[i].classList.remove(this.marks.O);
  }
  this.marks.count = 0;
};

TicTacToe.prototype.reset = function () {
  this.empty();
  this.scores = { X: 0, O: 0 };
};

var placeholder = document.getElementById("placeholder");
var tictactoe = new TicTacToe(placeholder, 3, onResult);

function onResult(result, scores) {
  if (result == "draw") {
    showFloatingMessage("It's a draw! 🤝");
  } else {
    // Map mark to Player
    let playerName = result === "X" ? "Player 1" : "Player 2";
    showFloatingMessage(playerName + " has won! 🎉");
    updateScores(scores.X, scores.O);
  }
  tictactoe.empty();
}

function showFloatingMessage(message) {
  const msg = document.createElement("div");
  msg.className = "floating-message";
  msg.innerText = message;
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 3000);
}

function updateScores(X, O) {
  document.querySelector("#scoreboard #player1").innerHTML = X;
  document.querySelector("#scoreboard #player2").innerHTML = O;
}

function restart(grid_size) {
  tictactoe.reset();
  updateScores(0, 0);
  if (grid_size) {
    tictactoe.paint(grid_size);
  }
}
