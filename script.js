"use strict";

/*
=========================================================
 COLOR CARNIVAL
 Educational probability experiment

 6 COLORS
 3 BOXES
 FAIR MODE
 BIAS MODE
=========================================================
*/


/* COLORS */

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


/* VARIABLES */

let selectedColor = null;
let biasedMode = false;
let spinning = false;

let rounds = 0;
let balance = 1000;


/*
    Number of times each color
    appeared in all three boxes.
*/

const counts = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    purple: 0,
    orange: 0
};


/* DOM */

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


/* CREATE STATISTICS */

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

createStats();


/* GET PROBABILITIES */

function getProbabilities() {

    /*
        FAIR MODE
        6 colors = 16.666...% each
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

        Selected color receives
        the probability from slider.

        The remaining probability
        is divided between the
        other five colors.
    */

    const selectedPercent =
        Number(slider.value);

    const selectedProbability =
        selectedPercent / 100;

    const remaining =
        1 - selectedProbability;

    const otherProbability =
        remaining / 5;

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


/* RANDOM COLOR */

function randomColor() {

    const probabilities =
        getProbabilities();

    const random =
        Math.random();

    let total = 0;


    for (const color of COLORS) {

        total +=
            probabilities[color];

        if (random < total) {

            return color;

        }

    }


    return COLORS[COLORS.length - 1];
}


/* COLOR VISUALS */

const colorStyles = {

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


/* SHOW RESULT IN BOX */

function showBox(box, color) {

    box.style.background =
        colorStyles[color].background;

    box.style.boxShadow =
        colorStyles[color].shadow;


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


/* RESET BOX */

function resetBox(box) {

    box.style.background =
        "linear-gradient(145deg,#9562b9,#50246d)";

    box.style.boxShadow =
        "inset 0 5px 0 rgba(255,255,255,.2),
         0 10px 0 #321737,
         0 20px 30px rgba(0,0,0,.3)";


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


/* SPIN */

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
        "SPINNING...";


    boxes.forEach(box => {

        resetBox(box);

        box.classList.add(
            "spinning"
        );

    });


    /*
        Generate three independent results.
    */

    const results = [
        randomColor(),
        randomColor(),
        randomColor()
    ];


    await delay(800);


    /*
        Reveal boxes one by one.
    */

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


    processResults(results);


    spinning = false;

    spinButton.disabled =
        false;
}


/* PROCESS RESULT */

function processResults(results) {

    rounds++;


    roundsElement.textContent =
        rounds.toLocaleString();


    /*
        Count each box result.
    */

    results.forEach(color => {

        counts[color]++;

    });


    /*
        Educational point system.
        These are NOT real currency.
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
                `${NAMES[selectedColor]} APPEARED ${matches} TIME${matches === 1 ? "" : "S"} • +${points} PTS`;

        } else {

            balance -= 5;


            result.className =
                "result loss";


            result.textContent =
                `${NAMES[selectedColor]} DID NOT APPEAR • -5 PTS`;

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


/* SELECT COLOR */

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
                    NAMES[selectedColor];


                updateStats();

            }
        );

    });


/* MODE */

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
                "BIAS MODE ENABLED";

        } else {

            modeButton.textContent =
                "FAIR";

            modeButton.classList.remove(
                "bias"
            );

            result.textContent =
                "FAIR MODE ENABLED";

        }


        updateStats();

    }
);


/* SLIDER */

slider.addEventListener(
    "input",
    () => {

        probabilityValue.textContent =
            slider.value;

        updateStats();

    }
);


/* SEPARATE BOXES */

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


/* UPDATE STATISTICS */

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


        percent.textContent =
            `${actual.toFixed(2)}%`;


        fill.style.width =
            `${Math.min(actual,100)}%`;


        theory.textContent =
            `Theoretical: ${(probabilities[color] * 100).toFixed(2)}%`;

    });

}


/* MASS SIMULATION */

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


/* MASS BUTTONS */

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


/* RESET */

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
            button =>
                button.classList
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


/* DELAY */

function delay(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );
}


/* INITIALIZE */

resetSimulation();

