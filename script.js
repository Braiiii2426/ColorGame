"use strict";

/* =========================================================
   COLOR CARNIVAL
   Educational probability experiment
========================================================= */

const COLORS = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange"
];

const NAMES = {
    red: "RED",
    blue: "BLUE",
    green: "GREEN",
    yellow: "YELLOW",
    purple: "PURPLE",
    orange: "ORANGE"
};


/* =========================================================
   STATE
========================================================= */

let selectedColors = [];
let biasedMode = false;
let spinning = false;

let rounds = 0;
let balance = 1000;

const counts = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    purple: 0,
    orange: 0
};


/* =========================================================
   DOM
========================================================= */

const boxes = [
    document.getElementById("box1"),
    document.getElementById("box2"),
    document.getElementById("box3")
];

const boxArea =
    document.getElementById("boxArea");

const spinButton =
    document.getElementById("spinButton");

const separateButton =
    document.getElementById("separateButton");

const modeButton =
    document.getElementById("modeButton");

const result =
    document.getElementById("result");

const balanceElement =
    document.getElementById("balance");

const roundsElement =
    document.getElementById("rounds");

const selectedColorElement =
    document.getElementById("selectedColor");

const slider =
    document.getElementById("probabilitySlider");

const probabilityValue =
    document.getElementById("probabilityValue");

const statsGrid =
    document.getElementById("statsGrid");


/* =========================================================
   CREATE STATISTICS
========================================================= */

function createStats() {

    statsGrid.innerHTML = "";

    COLORS.forEach(color => {

        const card =
            document.createElement("div");

        card.className = "stat";

        card.innerHTML = `
            <div class="stat-top">
                <span class="stat-name">
                    ${NAMES[color]}
                </span>

                <span
                    class="stat-percent"
                    id="${color}Percent">
                    0.00%
                </span>
            </div>

            <div class="bar">
                <div
                    class="fill"
                    id="${color}Fill">
                </div>
            </div>

            <div
                class="theory"
                id="${color}Theory">
                Theoretical: 16.67%
            </div>
        `;

        statsGrid.appendChild(card);
    });
}


/* =========================================================
   PROBABILITY
========================================================= */

function getProbabilities() {

    /* FAIR MODE */

    if (
        !biasedMode ||
        selectedColors.length === 0
    ) {

        return {
            red: 1 / 6,
            blue: 1 / 6,
            green: 1 / 6,
            yellow: 1 / 6,
            purple: 1 / 6,
            orange: 1 / 6
        };
    }


    /*
        BIAS MODE

        The first selected color is the
        target used for the experiment.

        The slider controls its probability.
    */

    const target =
        selectedColors[0];

    const targetProbability =
        Number(slider.value) / 100;

    const otherProbability =
        (1 - targetProbability) / 5;

    const probabilities = {};

    COLORS.forEach(color => {

        if (color === target) {
            probabilities[color] =
                targetProbability;
        } else {
            probabilities[color] =
                otherProbability;
        }

    });

    return probabilities;
}


/* =========================================================
   RANDOM COLOR
========================================================= */

function randomColor() {

    const probabilities =
        getProbabilities();

    const random =
        Math.random();

    let cumulative = 0;

    for (const color of COLORS) {

        cumulative +=
            probabilities[color];

        if (random < cumulative) {
            return color;
        }
    }

    return COLORS[
        COLORS.length - 1
    ];
}


/* =========================================================
   COLOR VISUALS
========================================================= */

const boxStyles = {

    red: {
        background:
            "radial-gradient(circle at 35% 30%, #ff91a9, #df315d 60%, #7d1735)",

        shadow:
            "inset 0 5px rgba(255,255,255,.2), 0 15px 35px rgba(223,49,93,.35)"
    },

    blue: {
        background:
            "radial-gradient(circle at 35% 30%, #93bdff, #4083ed 60%, #174c98)",

        shadow:
            "inset 0 5px rgba(255,255,255,.2), 0 15px 35px rgba(64,131,237,.35)"
    },

    green: {
        background:
            "radial-gradient(circle at 35% 30%, #91efbd, #30c880 60%, #147143)",

        shadow:
            "inset 0 5px rgba(255,255,255,.2), 0 15px 35px rgba(48,200,128,.35)"
    },

    yellow: {
        background:
            "radial-gradient(circle at 35% 30%, #fff09a, #f3c936 60%, #aa7900)",

        shadow:
            "inset 0 5px rgba(255,255,255,.2), 0 15px 35px rgba(243,201,54,.35)"
    },

    purple: {
        background:
            "radial-gradient(circle at 35% 30%, #dbadff, #a051d7 60%, #5d237d)",

        shadow:
            "inset 0 5px rgba(255,255,255,.2), 0 15px 35px rgba(160,81,215,.35)"
    },

    orange: {
        background:
            "radial-gradient(circle at 35% 30%, #ffc08e, #f18038 60%, #a8400c)",

        shadow:
            "inset 0 5px rgba(255,255,255,.2), 0 15px 35px rgba(241,128,56,.35)"
    }
};


/* =========================================================
   DISPLAY BOX
========================================================= */

function showBox(box, color) {

    const style =
        boxStyles[color];

    box.style.background =
        style.background;

    box.style.boxShadow =
        style.shadow;

    const number =
        box.id.replace("box", "");

    box.innerHTML = `
        <div class="box-top">
            ${number}
        </div>

        <div class="box-inside">
            ${NAMES[color][0]}
        </div>
    `;
}


/* =========================================================
   RESET BOX
========================================================= */

function resetBox(box) {

    box.style.background =
        "linear-gradient(145deg,#9865bc,#51256e)";

    /* Fixed: one-line JavaScript string */

    box.style.boxShadow =
        "inset 0 5px 0 rgba(255,255,255,.2), 0 10px 0 #311637, 0 20px 30px rgba(0,0,0,.3)";

    const number =
        box.id.replace("box", "");

    box.innerHTML = `
        <div class="box-top">
            ${number}
        </div>

        <div class="box-inside">
            ?
        </div>
    `;
}


/* =========================================================
   SPIN
========================================================= */

async function spin() {

    if (spinning) {
        return;
    }

    spinning = true;

    spinButton.disabled = true;

    result.className =
        "result";

    result.textContent =
        "SPINNING...";


    /* Start animation */

    boxes.forEach(box => {

        resetBox(box);

        box.classList.add(
            "spinning"
        );

    });


    /* Generate three results */

    const results = [
        randomColor(),
        randomColor(),
        randomColor()
    ];


    /* Wait */

    await delay(900);


    /* Reveal each box */

    for (
        let i = 0;
        i < boxes.length;
        i++
    ) {

        boxes[i].classList.remove(
            "spinning"
        );

        showBox(
            boxes[i],
            results[i]
        );

        await delay(220);
    }


    processResults(results);


    spinning = false;

    spinButton.disabled = false;
}


/* =========================================================
   PROCESS RESULTS
========================================================= */

function processResults(results) {

    rounds++;

    roundsElement.textContent =
        rounds.toLocaleString();


    /* Count all three results */

    results.forEach(color => {

        counts[color]++;

    });


    /*
        Multiple color selection.

        Example:

        selectedColors =
        ["red", "blue", "purple"]

        results =
        ["red", "green", "blue"]

        matched =
        ["red", "blue"]
    */

    if (
        selectedColors.length > 0
    ) {

        const matches =
            results.filter(
                color =>
                    selectedColors.includes(color)
            );


        if (
            matches.length > 0
        ) {

            const uniqueMatches =
                [...new Set(matches)];


            const names =
                uniqueMatches
                    .map(
                        color =>
                            NAMES[color]
                    )
                    .join(" + ");


            result.className =
                "result win";


            result.textContent =
                `${names} APPEARED!`;


            /*
                Fictional simulation points only.
            */

            balance +=
                matches.length * 10;

        } else {

            balance -= 5;


            result.className =
                "result loss";


            result.textContent =
                "NONE OF YOUR SELECTED COLORS APPEARED";

        }

    } else {

        result.textContent =
            results
                .map(
                    color =>
                        NAMES[color]
                )
                .join(" • ");
    }


    balanceElement.textContent =
        balance.toLocaleString();


    updateStats();
}


/* =========================================================
   MULTIPLE COLOR SELECTION
========================================================= */

document
    .querySelectorAll(".color-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const color =
                    this.dataset.color;


                const index =
                    selectedColors.indexOf(
                        color
                    );


                /*
                    Already selected:
                    remove it.
                */

                if (index !== -1) {

                    selectedColors.splice(
                        index,
                        1
                    );

                    this.classList.remove(
                        "active"
                    );

                }


                /*
                    Not selected:
                    add it.
                */

                else {

                    selectedColors.push(
                        color
                    );

                    this.classList.add(
                        "active"
                    );
                }


                /*
                    Update display.
                */

                if (
                    selectedColors.length === 0
                ) {

                    selectedColorElement.textContent =
                        "NONE";

                } else {

                    selectedColorElement.textContent =
                        selectedColors
                            .map(
                                color =>
                                    NAMES[color]
                            )
                            .join(", ");
                }


                updateStats();

            }
        );

    });


/* =========================================================
   FAIR / BIAS
========================================================= */

modeButton.addEventListener(
    "click",
    function () {

        biasedMode =
            !biasedMode;


        if (biasedMode) {

            this.textContent =
                "SELECTED COLOR BIAS";

            this.classList.add(
                "bias"
            );

            result.textContent =
                "BIAS MODE ENABLED";

        } else {

            this.textContent =
                "FAIR";

            this.classList.remove(
                "bias"
            );

            result.textContent =
                "FAIR MODE ENABLED";
        }


        updateStats();

    }
);


/* =========================================================
   SLIDER
========================================================= */

slider.addEventListener(
    "input",
    function () {

        probabilityValue.textContent =
            this.value;

        updateStats();

    }
);


/* =========================================================
   SEPARATE BOXES
========================================================= */

separateButton.addEventListener(
    "click",
    function () {

        boxArea.classList.toggle(
            "separated"
        );


        if (
            boxArea.classList.contains(
                "separated"
            )
        ) {

            this.textContent =
                "↔ JOIN BOXES";

        } else {

            this.textContent =
                "↔ SEPARATE BOXES";
        }

    }
);


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStats() {

    const totalResults =
        rounds * 3;

    const probabilities =
        getProbabilities();


    COLORS.forEach(color => {

        let actual = 0;


        if (totalResults > 0) {

            actual =
                (
                    counts[color] /
                    totalResults
                ) * 100;
        }


        const percent =
            document.getElementById(
                `${color}Percent`
            );

        const fill =
            document.getElementById(
                `${color}Fill`
            );

        const theory =
            document.getElementById(
                `${color}Theory`
            );


        if (percent) {

            percent.textContent =
                `${actual.toFixed(2)}%`;
        }


        if (fill) {

            fill.style.width =
                `${Math.min(actual, 100)}%`;
        }


        if (theory) {

            theory.textContent =
                `Theoretical: ${(probabilities[color] * 100).toFixed(2)}%`;
        }

    });
}


/* =========================================================
   RAPID SIMULATION
========================================================= */

function runRounds(amount) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        counts[randomColor()]++;
        counts[randomColor()]++;
        counts[randomColor()]++;

    }


    rounds += amount;


    roundsElement.textContent =
        rounds.toLocaleString();


    result.className =
        "result";


    result.textContent =
        `${amount.toLocaleString()} ROUNDS SIMULATED`;


    updateStats();
}


/* =========================================================
   RAPID BUTTONS
========================================================= */

document
    .getElementById("run100")
    .addEventListener(
        "click",
        function () {

            runRounds(100);

        }
    );


document
    .getElementById("run1000")
    .addEventListener(
        "click",
        function () {

            runRounds(1000);

        }
    );


document
    .getElementById("run10000")
    .addEventListener(
        "click",
        function () {

            runRounds(10000);

        }
    );


/* =========================================================
   RESET
========================================================= */

document
    .getElementById("reset")
    .addEventListener(
        "click",
        resetSimulation
    );


function resetSimulation() {

    rounds = 0;

    balance = 1000;

    selectedColors = [];

    biasedMode = false;


    COLORS.forEach(color => {

        counts[color] = 0;

    });


    document
        .querySelectorAll(".color-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    selectedColorElement.textContent =
        "NONE";


    modeButton.textContent =
        "FAIR";


    modeButton.classList.remove(
        "bias"
    );


    balanceElement.textContent =
        "1000";


    roundsElement.textContent =
        "0";


    probabilityValue.textContent =
        slider.value;


    result.className =
        "result";


    result.textContent =
        "READY TO SPIN!";


    boxArea.classList.remove(
        "separated"
    );


    separateButton.textContent =
        "↔ SEPARATE BOXES";


    boxes.forEach(box => {

        box.classList.remove(
            "spinning"
        );

        resetBox(box);

    });


    updateStats();
}


/* =========================================================
   DELAY
========================================================= */

function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

createStats();

boxes.forEach(
    box =>
        resetBox(box)
);

updateStats();

