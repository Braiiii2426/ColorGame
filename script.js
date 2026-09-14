
"use strict";

/*
=========================================================
 COLOR CARNIVAL
 Educational probability experiment

 6 COLORS
 3 BOXES
 FAIR MODE
 SELECTED-COLOR BIAS MODE

 No real money is involved.
=========================================================
*/


/* -----------------------------
   COLORS
----------------------------- */

const COLORS = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange"
];


const COLOR_NAMES = {
    red: "RED",
    blue: "BLUE",
    green: "GREEN",
    yellow: "YELLOW",
    purple: "PURPLE",
    orange: "ORANGE"
};


/* -----------------------------
   VARIABLES
----------------------------- */

let selectedColor = null;

let biasedMode = false;

let spinning = false;

let rounds = 0;

let balance = 1000;


/*
Counts how many times each
color has appeared.

Every round creates
THREE results.
*/

const counts = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    purple: 0,
    orange: 0
};


/* -----------------------------
   DOM ELEMENTS
----------------------------- */

const boxArea =
    document.getElementById("boxArea");

const boxes = [
    document.getElementById("box1"),
    document.getElementById("box2"),
    document.getElementById("box3")
];

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


/* -----------------------------
   PROBABILITY
----------------------------- */

function getProbabilities() {

    /*
    FAIR:
    Every color = 16.6667%
    */

    if (!biasedMode || !selectedColor) {

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

    Selected color gets the
    probability chosen by slider.

    The remainder is split
    between the other 5 colors.
    */

    const selectedPercent =
        Number(slider.value);

    const selectedProbability =
        selectedPercent / 100;

    const remainingProbability =
        1 - selectedProbability;

    const otherProbability =
        remainingProbability / 5;


    const probabilities = {};


    COLORS.forEach(color => {

        if (color === selectedColor) {

            probabilities[color] =
                selectedProbability;

        } else {

            probabilities[color] =
                otherProbability;
        }

    });


    return probabilities;
}


/* -----------------------------
   RANDOM COLOR
----------------------------- */

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


    /*
    Safety fallback.
    */

    return COLORS[COLORS.length - 1];
}


/* -----------------------------
   COLOR VISUALS
----------------------------- */

const COLOR_STYLES = {

    red: {
        background:
            "radial-gradient(circle at 35% 30%, #ff91a9, #df315d 60%, #7d1735)",
        shadow:
            "0 18px 35px rgba(223,49,93,.35), inset 0 4px 0 rgba(255,255,255,.2)"
    },

    blue: {
        background:
            "radial-gradient(circle at 35% 30%, #93bdff, #4083ed 60%, #174c98)",
        shadow:
            "0 18px 35px rgba(64,131,237,.35), inset 0 4px 0 rgba(255,255,255,.2)"
    },

    green: {
        background:
            "radial-gradient(circle at 35% 30%, #91efbd, #30c880 60%, #147143)",
        shadow:
            "0 18px 35px rgba(48,200,128,.35), inset 0 4px 0 rgba(255,255,255,.2)"
    },

    yellow: {
        background:
            "radial-gradient(circle at 35% 30%, #fff09a, #f3c936 60%, #aa7900)",
        shadow:
            "0 18px 35px rgba(243,201,54,.35), inset 0 4px 0 rgba(255,255,255,.2)"
    },

    purple: {
        background:
            "radial-gradient(circle at 35% 30%, #dbadff, #a051d7 60%, #5d237d)",
        shadow:
            "0 18px 35px rgba(160,81,215,.35), inset 0 4px 0 rgba(255,255,255,.2)"
    },

    orange: {
        background:
            "radial-gradient(circle at 35% 30%, #ffc08e, #f18038 60%, #a8400c)",
        shadow:
            "0 18px 35px rgba(241,128,56,.35), inset 0 4px 0 rgba(255,255,255,.2)"
    }

};


/* -----------------------------
   SHOW BOX COLOR
----------------------------- */

function showBox(box, color) {

    const style =
        COLOR_STYLES[color];

    box.style.background =
        style.background;

    box.style.boxShadow =
        style.shadow;


    box.innerHTML = `
        <div class="box-top">
            ${box.id.replace("box", "")}
        </div>

        <div class="box-inside">
            ${COLOR_NAMES[color][0]}
        </div>
    `;

}


/* -----------------------------
   RESET BOX
----------------------------- */

function resetBox(box) {

    box.style.background =
        "linear-gradient(145deg,#9562b9,#50246d)";

    box.style.boxShadow =
        "inset 0 5px 0 rgba(255,255,255,.2), 0 10px 0 #321737, 0 20px 30px rgba(0,0,0,.3)";

    box.innerHTML = `
        <div class="box-top">
            ${box.id.replace("box", "")}
        </div>

        <div class="box-inside">
            ?
        </div>
    `;

}


/* -----------------------------
   SPIN
----------------------------- */

spinButton.addEventListener(
    "click",
    spin
);


async function spin() {

    if (spinning) {
        return;
    }


    spinning = true;

    spinButton.disabled =
        true;


    result.className =
        "result";

    result.textContent =
        "THE WHEEL IS SPINNING...";


    /*
    Reset appearance first.
    */

    boxes.forEach(box => {

        resetBox(box);

        box.classList.add(
            "spinning"
        );

    });


    /*
    Generate results.
    */

    const results = [
        randomColor(),
        randomColor(),
        randomColor()
    ];


    /*
    Animation.
    */

    await delay(700);


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

        await delay(180);

    }


    /*
    Process result.
    */

    processResults(
        results
    );


    spinning = false;

    spinButton.disabled =
        false;
}


/* -----------------------------
   PROCESS RESULT
----------------------------- */

function processResults(results) {

    rounds++;


    roundsElement.textContent =
        rounds.toLocaleString();


    /*
    Count every box result.
    */

    results.forEach(color => {

        counts[color]++;

    });


    /*
    Educational points.

    +10 per matching selected color
    -5 when selected color doesn't appear
    */

    if (selectedColor) {

        const matches =
            results.filter(
                color =>
                    color === selectedColor
            ).length;


        if (matches > 0) {

            const points =
                matches * 10;

            balance += points;

            result.className =
                "result win";

            result.textContent =
                `${COLOR_NAMES[selectedColor]} APPEARED ${matches} TIME${matches === 1 ? "" : "S"} • +${points} PTS`;

        } else {

            balance -= 5;

            result.className =
                "result loss";

            result.textContent =
                `${COLOR_NAMES[selectedColor]} DID NOT APPEAR • -5 PTS`;

        }

    } else {

        result.textContent =
            results
                .map(
                    color =>
                        COLOR_NAMES[color]
                )
                .join(" • ");

    }


    balanceElement.textContent =
        balance.toLocaleString();


    updateStats();
}


/* -----------------------------
   SELECT COLOR
----------------------------- */

document
    .querySelectorAll(".color-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".color-btn")
                    .forEach(
                        btn =>
                            btn.classList
                                .remove("active")
                    );


                button.classList.add(
                    "active"
                );


                selectedColor =
                    button.dataset.color;


                selectedColorElement.textContent =
                    COLOR_NAMES[selectedColor];


                updateStats();
            }
        );

    });


/* -----------------------------
   MODE SWITCH
----------------------------- */

modeButton.addEventListener(
    "click",
    () => {

        biasedMode =
            !biasedMode;


        if (biasedMode) {

            modeButton.textContent =
                "SELECTED COLOR BIAS";

            modeButton.classList.add(
                "bias"
            );

            result.textContent =
                "BIAS MODE";

        } else {

            modeButton.textContent =
                "FAIR";

            modeButton.classList.remove(
                "bias"
            );

            result.textContent =
                "FAIR MODE";

        }


        updateStats();
    }
);


/* -----------------------------
   SLIDER
----------------------------- */

slider.addEventListener(
    "input",
    () => {

        probabilityValue.textContent =
            slider.value;


        updateStats();
    }
);


/* -----------------------------
   SEPARATE BOXES
----------------------------- */

separateButton.addEventListener(
    "click",
    () => {

        boxArea.classList.toggle(
            "separated"
        );


        if (
            boxArea.classList.contains(
                "separated"
            )
        ) {

            separateButton.textContent =
                "↔ JOIN BOXES";

        } else {

            separateButton.textContent =
                "↔ SEPARATE BOXES";

        }

    }
);


/* -----------------------------
   STATISTICS
----------------------------- */

function createStats() {

    const grid =
        document.getElementById(
            "statsGrid"
        );


    grid.innerHTML = "";


    COLORS.forEach(color => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "stat";


        card.innerHTML = `
            <div class="stat-top">

                <span class="stat-name">
                    ${COLOR_NAMES[color]}
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


        grid.appendChild(card);

    });

}


createStats();


function updateStats() {

    const totalResults =
        rounds * 3;


    const probabilities =
        getProbabilities();


    COLORS.forEach(color => {

        let actual =
            0;


        if (totalResults > 0) {

            actual =
                counts[color] /
                totalResults *
                100;

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


        percent.textContent =
            `${actual.toFixed(2)}%`;


        fill.style.width =
            `${Math.min(actual,100)}%`;


        theory.textContent =
            `Theoretical: ${(probabilities[color] * 100).toFixed(2)}%`;

    });

}


/* -----------------------------
   MASS SIMULATION
----------------------------- */

function runRounds(amount) {

    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const first =
            randomColor();

        const second =
            randomColor();

        const third =
            randomColor();


        counts[first]++;
        counts[second]++;
        counts[third]++;
    }


    rounds += amount;


    roundsElement.textContent =
        rounds.toLocaleString();


    updateStats();


    result.className =
        "result";


    result.textContent =
        `${amount.toLocaleString()} ROUNDS SIMULATED`;

}


/* -----------------------------
   TEST BUTTONS
----------------------------- */

document
    .getElementById("run100")
    .addEventListener(
        "click",
        () => runRounds(100)
    );


document
    .getElementById("run1000")
    .addEventListener(
        "click",
        () => runRounds(1000)
    );


document
    .getElementById("run10000")
    .addEventListener(
        "click",
        () => runRounds(10000)
    );


/* -----------------------------
   RESET
----------------------------- */

document
    .getElementById("reset")
    .addEventListener(
        "click",
        resetSimulation
    );


function resetSimulation() {

    rounds = 0;

    balance = 1000;

    selectedColor = null;

    biasedMode = false;


    COLORS.forEach(color => {

        counts[color] = 0;

    });


    document
        .querySelectorAll(".color-btn")
        .forEach(
            btn =>
                btn.classList
                    .remove("active")
        );


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


    boxes.forEach(
        box =>
            resetBox(box)
    );


    updateStats();
}


/* -----------------------------
   DELAY
----------------------------- */

function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}

