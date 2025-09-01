const resultEl = document.getElementById("result-display");
const keypadEl = document.getElementById("keypad");
const degButton = document.getElementById("angle-deg");
const radButton = document.getElementById("angle-rad");
const modeToggleButton = document.getElementById("mode-toggle");

let expression = "",
  angleMode = "DEG",
  memory = 0;
let calcType = "scientific"; // or 'standard'

// Button layouts
const standardButtons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "%",
  "+",
  "C",
  "⌫",
  "=",
];

const scientificButtons = [
  "MC",
  "MR",
  "M+",
  "M-",
  "(",
  ")",
  "sin",
  "cos",
  "tan",
  "√",
  "^",
  "C",
  "7",
  "8",
  "9",
  "/",
  "pi",
  "⌫",
  "4",
  "5",
  "6",
  "*",
  "ln",
  "log",
  "1",
  "2",
  "3",
  "-",
  "e",
  "x!",
  "0",
  ".",
  "+",
  "%",
  "=",
  "Ans",
];

// Load keypad layout
function loadKeys(layout) {
  keypadEl.innerHTML = "";
  const cols = calcType === "scientific" ? 6 : 4;
  keypadEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  layout.forEach((symbol) => {
    const btn = document.createElement("button");
    btn.textContent = symbol;
    if (/^[a-z√^π%]+$/i.test(symbol)) btn.classList.add("fn");
    if (/^[/*+\-]$/.test(symbol)) btn.classList.add("op");
    if (symbol === "C" || symbol === "⌫") btn.classList.add("danger");
    if (symbol === "=") btn.classList.add("equals");
    btn.onclick = () => handleInput(symbol);
    keypadEl.appendChild(btn);
  });
}

// Handle button press
function handleInput(symbol) {
  if (symbol === "C") {
    expression = "";
    resultEl.textContent = "0";
  } else if (symbol === "⌫") {
    expression = expression.slice(0, -1);
  } else if (symbol === "=") {
    calculate();
    return;
  } else if (symbol === "MC") {
    memory = 0;
  } else if (symbol === "MR") {
    expression += memory;
  } else if (symbol === "M+") {
    memory += Number(resultEl.textContent) || 0;
  } else if (symbol === "M-") {
    memory -= Number(resultEl.textContent) || 0;
  } else {
    expression += mapSymbol(symbol);
  }

  resultEl.textContent = expression || "0";
}

function mapSymbol(symbol) {
  return { pi: "π", e: "e", Ans: resultEl.textContent }[symbol] || symbol;
}

// Calculate expression
function calculate() {
  try {
    let val = expression
      .replace(/π/g, Math.PI)
      .replace(/√/g, "Math.sqrt")
      .replace(/\^/g, "**")
      .replace(/ln/g, "Math.log")
      .replace(/log/g, "Math.log10")
      .replace(/x!/g, (match) =>
        factorial(parseFloat(expression.match(/(\d+)(?=!)/)?.[0] || 0))
      );

    if (angleMode === "DEG") {
      val = val
        .replace(/sin\((.*?)\)/g, (_, arg) => `Math.sin((${arg})*Math.PI/180)`)
        .replace(/cos\((.*?)\)/g, (_, arg) => `Math.cos((${arg})*Math.PI/180)`)
        .replace(/tan\((.*?)\)/g, (_, arg) => `Math.tan((${arg})*Math.PI/180)`);
    } else {
      val = val
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan");
    }

    const result = Function(`return ${val}`)();
    resultEl.textContent = result;
    expression = result.toString(); // ✅ so you can continue calculation
  } catch {
    resultEl.textContent = "Error";
  }
}

// Factorial
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

// DEG/RAD toggle
degButton.onclick = () => {
  angleMode = "DEG";
  degButton.classList.add("active");
  radButton.classList.remove("active");
};
radButton.onclick = () => {
  angleMode = "RAD";
  radButton.classList.add("active");
  degButton.classList.remove("active");
};

// Mode switch
modeToggleButton.onclick = () => {
  calcType = calcType === "scientific" ? "standard" : "scientific";
  modeToggleButton.textContent =
    calcType === "scientific" ? "Scientific" : "Standard";
  loadKeys(calcType === "scientific" ? scientificButtons : standardButtons);
};

// Initial load
loadKeys(scientificButtons);

// Enable keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key; // which key was pressed

  // Digits and decimal
  if (/^[0-9.]$/.test(key)) {
    handleInput(key);
  }
  // Operators
  else if (["+", "-", "*", "/", "%"].includes(key)) {
    handleInput(key);
  }
  // Enter → equals
  else if (key === "Enter") {
    handleInput("=");
  }
  // Backspace → delete
  else if (key === "Backspace") {
    handleInput("⌫");
  }
  // Escape → clear
  else if (key === "Escape") {
    handleInput("C");
  }
  // Parentheses
  else if (["(", ")"].includes(key)) {
    handleInput(key);
  }
});
