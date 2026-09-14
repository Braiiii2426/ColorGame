"use strict";


/* =========================================
   COLOR DATA
========================================= */

const COLORS = [

  {
    name: "Red",
    hex: "#ff416c",
    rgb: "255,65,108"
  },

  {
    name: "Blue",
    hex: "#4788ff",
    rgb: "71,136,255"
  },

  {
    name: "Green",
    hex: "#30ca82",
    rgb: "48,202,130"
  },

  {
    name: "Yellow",
    hex: "#f2cc3c",
    rgb: "242,204,60"
  },

  {
    name: "Purple",
    hex: "#a050db",
    rgb: "160,80,219"
  },

  {
    name: "Orange",
    hex: "#f18038",
    rgb: "241,128,56"
  }

];


/* =========================================
   GAME STATE
========================================= */

const state = {

  mode: "fair",

  selected: new Set(),

  rounds: 0,

  points: 1000,

  wins: 0,

  losses: 0,

  boxSeparated: false,

  counts:
    Object.fromEntries(
      COLORS.map(
        color => [color.name, 0]
      )
    ),

  recent: [],

  spinning: false,

  roundTimer: null

};


/* =========================================
   SHORTCUT
========================================= */

const $ = (id) =>
  document.getElementById(id);


/* =========================================
   GET COLOR
========================================= */

function colorByName(name) {

  return COLORS.find(
    color =>
      color.name === name
  );

}


/* =========================================
   SYSTEM STATUS
========================================= */

function setStatus(
  message,
  type = ""
) {

  const status =
    $("systemStatus");

  if (!status) {
    return;
  }

  status.textContent =
    message;

  status.className =
    `system-status ${type}`.trim();

}


/* =========================================
   WEIGHT CALCULATION
========================================= */

function weightedPool() {

  /*
    FAIR MODE
    ----------
    Every color = equal chance.
  */

  if (
    state.mode === "fair" ||
    state.selected.size === 0
  ) {

    return COLORS.map(
      color => ({
        ...color,
        weight: 1
      })
    );

  }


  /*
    BIAS STUDY MODE
    ----------------
    This is deliberately transparent.

    The FIRST selected color receives
    the probability chosen by the slider.

    The rest share the remaining probability.
  */

  const firstSelected =
    [...state.selected][0];

  const slider =
    Number(
      $("probabilitySlider").value
    );

  const targetWeight =
    Math.max(1, slider);

  const remainingWeight =
    100 - targetWeight;

  const others =
    COLORS.filter(
      color =>
        color.name !== firstSelected
    );

  const eachOther =
    remainingWeight /
    others.length;


  return COLORS.map(
    color => ({

      ...color,

      weight:
        color.name === firstSelected
          ? targetWeight
          : eachOther

    })
  );

}


/* =========================================
   RANDOM WEIGHTED PICK
========================================= */

function pickWeighted() {

  const pool =
    weightedPool();

  const total =
    pool.reduce(
      (sum, item) =>
        sum + item.weight,
      0
    );

  let roll =
    Math.random() * total;


  for (
    const item of pool
  ) {

    roll -= item.weight;

    if (roll <= 0) {

      return item;

    }

  }


  return pool[
    pool.length - 1
  ];

}


/* =========================================
   THEORETICAL PROBABILITY
========================================= */

function theoreticalProbability(
  colorName
) {

  if (
    state.mode === "fair" ||
    state.selected.size === 0
  ) {

    return 100 / COLORS.length;

  }


  const firstSelected =
    [...state.selected][0];

  const slider =
    Number(
      $("probabilitySlider").value
    );


  if (
    colorName === firstSelected
  ) {

    return slider;

  }


  return (
    100 - slider
  ) /
  (COLORS.length - 1);

}


/* =========================================
   CREATE COLOR BUTTONS
========================================= */

function renderColorButtons() {

  const wrap =
    $("colorButtons");

  wrap.innerHTML = "";


  COLORS.forEach(
    color => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "color-btn";


      button.dataset.color =
        color.name;


      button.style.setProperty(
        "--swatch",
        color.hex
      );


      button.innerHTML = `

        <span class="swatch"></span>

        <span>
          ${color.name}
        </span>

        <span class="check">
          ✓
        </span>

      `;


      button.addEventListener(
        "click",
        () =>
          toggleColor(
            color.name
          )
      );


      wrap.appendChild(
        button
      );

    }
  );

}


/* =========================================
   COLOR SELECTION
========================================= */

function toggleColor(name) {

  if (
    state.selected.has(name)
  ) {

    state.selected.delete(
      name
    );

  } else {

    state.selected.add(
      name
    );

  }


  renderSelection();


  if (
    state.mode === "bias"
  ) {

    updateProbabilityUI();

  }

}


/* =========================================
   DISPLAY SELECTION
========================================= */

function renderSelection() {

  document
    .querySelectorAll(
      ".color-btn"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          state.selected.has(
            button.dataset.color
          )
        );

      }
    );


  const names =
    [...state.selected];


  $("selectedColor").textContent =
    names.length
      ? names.join(", ")
      : "No colors selected";


  $("selectedCount").textContent =
    `${names.length}/6 selected`;

}


/* =========================================
   PROBABILITY CONTROL
========================================= */

function updateProbabilityUI() {

  const slider =
    $("probabilitySlider");

  const value =
    $("probabilityValue");

  const label =
    $("biasTarget");


  if (
    state.mode === "fair" ||
    state.selected.size === 0
  ) {

    slider.disabled =
      true;

    label.textContent =
      "Choose at least one color for the educational bias experiment.";

    value.textContent =
      "Disabled";

    return;
  }


  slider.disabled =
    false;


  const firstSelected =
    [...state.selected][0];


  value.textContent =
    `${slider.value}%`;


  label.textContent =
    `${firstSelected} is assigned ${slider.value}% theoretical probability. Other colors share the remainder.`;

}


/* =========================================
   MODE DISPLAY
========================================= */

function renderMode() {

  const button =
    $("modeButton");

  const title =
    $("modeTitle");

  const description =
    $("modeDescription");


  button.classList.toggle(
    "bias",
    state.mode === "bias"
  );


  button.textContent =
    state.mode === "fair"
      ? "FAIR MODE"
      : "BIAS STUDY MODE";


  title.textContent =
    state.mode === "fair"
      ? "Fair Random Draw"
      : "Transparent Bias Experiment";


  description.textContent =
    state.mode === "fair"

      ? "Every color receives an equal probability on each box."

      : "Educational simulation: probability changes are displayed openly for comparison.";


  updateProbabilityUI();

}


/* =========================================
   STATISTICS
========================================= */

function renderStats() {

  $("rounds").textContent =
    state.rounds.toLocaleString();


  $("balance").textContent =
    state.points.toLocaleString();


  $("wins").textContent =
    state.wins.toLocaleString();


  $("losses").textContent =
    state.losses.toLocaleString();


  $("winRate").textContent =
    state.rounds

      ? (
          (state.wins /
            state.rounds) *
          100
        ).toFixed(2) + "%"

      : "0.00%";


  const grid =
    $("statsGrid");


  grid.innerHTML = "";


  COLORS.forEach(
    color => {

      const actual =
        state.rounds

          ? (
              state.counts[color.name] /
              (state.rounds * 3)
            ) * 100

          : 0;


      const theoretical =
        theoreticalProbability(
          color.name
        );


      const card =
        document.createElement(
          "div"
        );


      card.className =
        "stat-card";


      card.innerHTML = `

        <div class="stat-head">

          <span
            class="mini-swatch"
            style="
              --swatch:${color.hex};
              background:${color.hex}
            "
          ></span>

          <strong>
            ${color.name}
          </strong>

        </div>


        <div class="stat-number">
          ${state.counts[color.name]
            .toLocaleString()}
        </div>


        <div class="stat-meta">

          Actual
          ${actual.toFixed(2)}%

          ·

          Theory
          ${theoretical.toFixed(2)}%

        </div>


        <div class="bar">

          <span
            style="
              width:${Math.min(
                100,
                actual
              )}%;

              background:
                ${color.hex}
            "
          ></span>

        </div>

      `;


      grid.appendChild(
        card
      );

    }
  );

}


/* =========================================
   RESET BOXES
========================================= */

function resetBoxes() {

  document
    .querySelectorAll(
      ".prize-box"
    )
    .forEach(
      (box, index) => {

        box.classList.remove(
          "spinning",
          "revealed"
        );


        box.style.setProperty(
          "--box-color",
          "#32105a"
        );


        box.innerHTML = `

          <div class="box-glow"></div>

          <div class="box-top">

            <span>
              BOX
            </span>

            <b>
              ${index + 1}
            </b>

          </div>


          <div class="box-door">

            <span>
              ?
            </span>

          </div>


          <div class="box-bottom">

            <span>
              READY
            </span>

          </div>

        `;

      }
    );

}


/* =========================================
   BOX ANIMATION
========================================= */

function animateBox(box) {

  box.classList.add(
    "spinning"
  );

}


/* =========================================
   REVEAL BOX
========================================= */

function revealBox(
  box,
  color,
  index
) {

  box.classList.remove(
    "spinning"
  );


  box.classList.add(
    "revealed"
  );


  box.style.setProperty(
    "--box-color",
    color.hex
  );


  box.innerHTML = `

    <div class="box-glow"></div>


    <div class="box-top">

      <span>
        BOX
      </span>

      <b>
        ${index + 1}
      </b>

    </div>


    <div class="box-door">

      <span class="symbol">
        ●
      </span>

      <small>
        ${color.name.toUpperCase()}
      </small>

    </div>


    <div class="box-bottom">

      <span>
        ${color.name.toUpperCase()}
      </span>

    </div>

  `;

}


/* =========================================
   RESULT MESSAGE
========================================= */

function updateSelectedResult(
  results
) {

  const selected =
    state.selected;


  const selectedHit =
    results.some(
      color =>
        selected.has(
          color.name
        )
    );


  const result =
    $("result");


  if (
    selected.size === 0
  ) {

    result.textContent =
      "Results revealed — select colors to test a prediction.";

    result.className =
      "result neutral";

    return;

  }


  if (selectedHit) {

    result.textContent =
      `MATCH! At least one box landed on your selected color${selected.size > 1 ? "s" : ""}.`;

    result.className =
      "result win";

  } else {

    result.textContent =
      "No match this round.";

    result.className =
      "result loss";

  }

}


/* =========================================
   PLAY ONE ROUND
========================================= */

function playRound({
  animate = true
} = {}) {

  if (
    state.spinning
  ) {

    return;

  }


  state.spinning =
    true;


  setStatus(
    "Drawing three independent boxes…",
    "busy"
  );


  $("spinButton").disabled =
    true;


  $("result").className =
    "result neutral";


  $("result").textContent =
    "SPINNING…";


  const boxes = [

    $("box1"),

    $("box2"),

    $("box3")

  ];


  if (animate) {

    boxes.forEach(
      animateBox
    );

  }


  const reveal = () => {

    const results = [

      pickWeighted(),

      pickWeighted(),

      pickWeighted()

    ];


    results.forEach(
      (color, index) => {

        state.counts[
          color.name
        ] += 1;


        revealBox(
          boxes[index],
          color,
          index
        );

      }
    );


    state.rounds += 1;


    const matched =
      results.some(
        color =>
          state.selected.has(
            color.name
          )
      );


    if (
      state.selected.size > 0
    ) {

      if (matched) {

        state.wins += 1;

        state.points += 25;

      } else {

        state.losses += 1;

        state.points =
          Math.max(
            0,
            state.points - 10
          );

      }

    }


    state.recent.unshift({

      round:
        state.rounds,

      results:
        results.map(
          result =>
            result.name
        ),

      matched

    });


    state.recent =
      state.recent.slice(
        0,
        8
      );


    updateSelectedResult(
      results
    );


    renderStats();

    renderRecent();


    state.spinning =
      false;


    $("spinButton").disabled =
      false;


    setStatus(
      "System ready • Random draw complete.",
      "ready"
    );

  };


  state.roundTimer =
    setTimeout(
      reveal,
      animate ? 850 : 0
    );

}


/* =========================================
   BATCH SIMULATION
========================================= */

function simulateMany(
  amount
) {

  if (
    state.spinning
  ) {

    return;

  }


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const results = [

      pickWeighted(),

      pickWeighted(),

      pickWeighted()

    ];


    results.forEach(
      color => {

        state.counts[
          color.name
        ] += 1;

      }
    );


    state.rounds += 1;


    const matched =
      results.some(
        color =>
          state.selected.has(
            color.name
          )
      );


    if (
      state.selected.size > 0
    ) {

      if (matched) {

        state.wins += 1;

        state.points += 25;

      } else {

        state.losses += 1;

        state.points =
          Math.max(
            0,
            state.points - 10
          );

      }

    }

  }


  state.recent.unshift({

    round:
      state.rounds,

    results: [

      "Batch simulation",

      `${amount.toLocaleString()} rounds`

    ],

    matched: false

  });


  state.recent =
    state.recent.slice(
      0,
      8
    );


  resetBoxes();


  $("result").textContent =
    `${amount.toLocaleString()} rounds simulated instantly.`;

  $("result").className =
    "result neutral";


  renderStats();

  renderRecent();


  setStatus(
    `Batch complete • ${amount.toLocaleString()} rounds added.`,
    "ready"
  );

}


/* =========================================
   RECENT HISTORY
========================================= */

function renderRecent() {

  const list =
    $("recentList");

  list.innerHTML = "";


  state.recent.forEach(
    item => {

      const row =
        document.createElement(
          "div"
        );


      row.className =
        "recent-row";


      row.innerHTML = `

        <span>
          #${item.round.toLocaleString()}
        </span>

        <strong>
          ${item.results.join(" · ")}
        </strong>

        <em
          class="${item.matched ? "yes" : ""}"
        >
          ${item.matched ? "MATCH" : "—"}
        </em>

      `;


      list.appendChild(
        row
      );

    }
  );


  if (
    !state.recent.length
  ) {

    list.innerHTML = `
      <div class="empty">
        No rounds recorded yet.
      </div>
    `;

  }

}


/* =========================================
   SEPARATE BOXES
========================================= */

function toggleSeparated() {

  state.boxSeparated =
    !state.boxSeparated;


  $("boxArea")
    .classList.toggle(
      "separated",
      state.boxSeparated
    );


  $("separateButton")
    .textContent =
      state.boxSeparated
        ? "JOIN BOXES"
        : "SEPARATE BOXES";

}


/* =========================================
   FULL RESET
========================================= */

function resetGame() {

  clearTimeout(
    state.roundTimer
  );


  state.mode =
    "fair";


  state.selected.clear();


  state.rounds =
    0;


  state.points =
    1000;


  state.wins =
    0;


  state.losses =
    0;


  state.boxSeparated =
    false;


  state.counts =
    Object.fromEntries(
      COLORS.map(
        color =>
          [color.name, 0]
      )
    );


  state.recent = [];


  state.spinning =
    false;


  $("probabilitySlider")
    .value = 8;


  $("boxArea")
    .classList.remove(
      "separated"
    );


  $("separateButton")
    .textContent =
      "SEPARATE BOXES";


  $("spinButton")
    .disabled = false;


  $("result").textContent =
    "Choose colors, then press SPIN.";


  $("result").className =
    "result neutral";


  renderSelection();

  renderMode();

  renderStats();

  renderRecent();

  resetBoxes();


  setStatus(
    "System reset • Ready for a new experiment.",
    "ready"
  );

}


/* =========================================
   START APPLICATION
========================================= */

function init() {

  renderColorButtons();

  renderSelection();

  renderMode();

  renderStats();

  renderRecent();

  resetBoxes();


  $("spinButton")
    .addEventListener(
      "click",
      () =>
        playRound({
          animate: true
        })
    );


  $("separateButton")
    .addEventListener(
      "click",
      toggleSeparated
    );


  $("modeButton")
    .addEventListener(
      "click",
      () => {

        state.mode =
          state.mode === "fair"
            ? "bias"
            : "fair";


        renderMode();


        setStatus(

          state.mode === "fair"

            ? "Fair mode enabled."

            : "Bias study enabled — probabilities are visible.",

          "ready"

        );

      }
    );


  $("probabilitySlider")
    .addEventListener(
      "input",
      updateProbabilityUI
    );


  $("run100")
    .addEventListener(
      "click",
      () =>
        simulateMany(100)
    );


  $("run1000")
    .addEventListener(
      "click",
      () =>
        simulateMany(1000)
    );


  $("run10000")
    .addEventListener(
      "click",
      () =>
        simulateMany(10000)
    );


  $("reset")
    .addEventListener(
      "click",
      resetGame
    );


  window.colorCarnivalReady =
    true;


  setStatus(
    "JavaScript connected • System ready.",
    "ready"
  );


  console.log(
    "Color Carnival JavaScript connected successfully."
  );

}


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);
