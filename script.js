```javascript
// ============================================================
// COLORLAB
// Educational Probability Simulator
// 6 colors × 3 independent boxes
// No real money is used.
// ============================================================

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange"
];

const displayNames = {
  red: "RED",
  blue: "BLUE",
  green: "GREEN",
  yellow: "YELLOW",
  purple: "PURPLE",
  orange: "ORANGE"
};

// Fair probability: every color = 1/6
const fairProbabilities = {
  red: 1 / 6,
  blue: 1 / 6,
  green: 1 / 6,
  yellow: 1 / 6,
  purple: 1 / 6,
  orange: 1 / 6
};

// Educational biased distribution.
// This is intentionally visible to the user.
// It demonstrates how changing probability changes
// long-term results.
const biasedProbabilities = {
  red: 0.30,
  blue: 0.20,
  green: 0.15,
  yellow: 0.15,
  purple: 0.10,
  orange: 0.10
};

let selectedColor = null;
let rounds = 0;
let balance = 1000;
let isSpinning = false;
let biasedMode = false;

const counts = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
  purple: 0,
  orange: 0
};

const boxElements = [
  document.getElementById("box1"),
  document.getElementById("box2"),
  document.getElementById("box3")
];

const balanceElement = document.getElementById("balance");
const roundsElement = document.getElementById("rounds");
const resultElement = document.getElementById("result");
const selectedElement = document.getElementById("selectedColor");
const spinButton = document.getElementById("spinButton");
const modeButton = document.getElementById("modeButton");
const statGrid = document.getElementById("statGrid");


// ------------------------------------------------------------
// Create statistics cards
// ------------------------------------------------------------

function createStats() {

  statGrid.innerHTML = "";

  colors.forEach(color => {

    const card = document.createElement("div");

    card.className = "stat";

    card.innerHTML = `
      <div class="stat-head">
        <span class="stat-name">${displayNames[color]}</span>
        <span class="stat-percent" id="${color}Percent">0.00%</span>
      </div>

      <div class="bar">
        <div class="bar-fill" id="${color}Bar"></div>
      </div>

      <div class="theory">
        Theoretical: 16.67%
      </div>
    `;

    statGrid.appendChild(card);

  });

}

createStats();


// ------------------------------------------------------------
// Color selection
// ------------------------------------------------------------

document.querySelectorAll(".color-choice").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".color-choice")
      .forEach(btn => btn.classList.remove("selected"));

    button.classList.add("selected");

    selectedColor = button.dataset.color;

    selectedElement.textContent =
      displayNames[selectedColor];

  });

});


// ------------------------------------------------------------
// Random color generator
// ------------------------------------------------------------

function randomColor() {

  const probabilities =
    biasedMode
      ? biasedProbabilities
      : fairProbabilities;

  const random = Math.random();

  let cumulative = 0;

  for (const color of colors) {

    cumulative += probabilities[color];

    if (random < cumulative) {
      return color;
    }

  }

  return colors[colors.length - 1];

}


// ------------------------------------------------------------
// Apply color to a box
// ------------------------------------------------------------

function setBoxColor(box, color) {

  const face = box.querySelector(".box-face");

  const colorStyles = {

    red: {
      background:
        "radial-gradient(circle, #ff6b89, #8e1636)",
      shadow:
        "0 0 45px rgba(255,69,109,.55)"
    },

    blue: {
      background:
        "radial-gradient(circle, #70a7ff, #174ca4)",
      shadow:
        "0 0 45px rgba(76,141,255,.55)"
    },

    green: {
      background:
        "radial-gradient(circle, #70f6ad, #147044)",
      shadow:
        "0 0 45px rgba(66,223,145,.55)"
    },

    yellow: {
      background:
        "radial-gradient(circle, #ffe985, #a67800)",
      shadow:
        "0 0 45px rgba(255,211,79,.55)"
    },

    purple: {
      background:
        "radial-gradient(circle, #d09aff, #6420a8)",
      shadow:
        "0 0 45px rgba(173,103,255,.55)"
    },

    orange: {
      background:
        "radial-gradient(circle, #ffb176, #a43f0e)",
      shadow:
        "0 0 45px rgba(255,146,77,.55)"
    }

  };

  face.style.background = colorStyles[color].background;
  face.style.boxShadow =
    `inset 0 1px rgba(255,255,255,.25),
     ${colorStyles[color].shadow}`;

  face.innerHTML = `
    <span style="
      color:white;
      text-shadow:0 2px 15px rgba(0,0,0,.4);
    ">
      ${displayNames[color][0]}
    </span>
  `;

}


// ------------------------------------------------------------
// Spin
// ------------------------------------------------------------

spinButton.addEventListener("click", spin);

async function spin() {

  if (isSpinning) return;

  isSpinning = true;
  spinButton.disabled = true;

  resultElement.className = "result";
  resultElement.textContent = "CALCULATING...";

  boxElements.forEach(box => {

    box.classList.add("spinning");

    const face = box.querySelector(".box-face");

    face.style.background =
      "linear-gradient(145deg, #292940, #0d0d18)";

    face.innerHTML = "<span>?</span>";

  });


  // Generate the three outcomes.
  const results = [
    randomColor(),
    randomColor(),
    randomColor()
  ];


  // Simulated animation time.
  await wait(1000);

  for (let i = 0; i < boxElements.length; i++) {

    await wait(250);

    boxElements[i].classList.remove("spinning");

    setBoxColor(
      boxElements[i],
      results[i]
    );

  }


  processResult(results);

  isSpinning = false;
  spinButton.disabled = false;

}


// ------------------------------------------------------------
// Process result
// ------------------------------------------------------------

function processResult(results) {

  rounds++;

  roundsElement.textContent = rounds;

  // Count every displayed box.
  results.forEach(color => {
    counts[color]++;
  });


  // Fake educational points.
  // This is not a gambling payout system.
  if (selectedColor) {

    const matches =
      results.filter(color =>
        color === selectedColor
      ).length;

    if (matches > 0) {

      // Educational points only.
      balance += matches * 10;

      resultElement.textContent =
        `${displayNames[selectedColor]} appeared ${matches} time${matches > 1 ? "s" : ""}! +${matches * 10} PTS`;

      resultElement.classList.add("win");

    } else {

      balance -= 10;

      resultElement.textContent =
        `${displayNames[selectedColor]} did not appear. -10 PTS`;

      resultElement.classList.add("loss");

    }

  } else {

    resultElement.textContent =
      results.map(color =>
        displayNames[color]
      ).join("  •  ");

  }


  balanceElement.textContent =
    balance.toLocaleString();

  updateStats();

}


// ------------------------------------------------------------
// Statistics
// ------------------------------------------------------------

function updateStats() {

  const totalBoxes = rounds * 3;

  colors.forEach(color => {

    const percentage =
      totalBoxes === 0
        ? 0
        : (counts[color] / totalBoxes) * 100;

    document.getElementById(`${color}Percent`)
      .textContent =
      `${percentage.toFixed(2)}%`;

    document.getElementById(`${color}Bar`)
      .style.width =
      `${Math.min(percentage, 100)}%`;

  });

}


// ------------------------------------------------------------
// Fair / biased educational mode
// ------------------------------------------------------------

modeButton.addEventListener("click", () => {

  biasedMode = !biasedMode;

  if (biasedMode) {

    modeButton.textContent = "BIASED";
    modeButton.classList.remove("fair");
    modeButton.classList.add("bias");

    resultElement.textContent =
      "BIASED MODE — EDUCATIONAL";

  } else {

    modeButton.textContent = "FAIR";
    modeButton.classList.remove("bias");
    modeButton.classList.add("fair");

    resultElement.textContent =
      "FAIR MODE — 1/6 EACH";

  }

});


// ------------------------------------------------------------
// Utility
// ------------------------------------------------------------

function wait(milliseconds) {

  return new Promise(resolve =>
    setTimeout(resolve, milliseconds)
  );

}
```
