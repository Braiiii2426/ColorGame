
/*
==========================================================
 COLORLAB
 6 colors × 3 boxes
 Educational probability experiment
==========================================================
*/

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


/*
 FAIR MODE
 Every color = 1/6 = 16.67%
*/

const FAIR = {
    red: 1 / 6,
    blue: 1 / 6,
    green: 1 / 6,
    yellow: 1 / 6,
    purple: 1 / 6,
    orange: 1 / 6
};


/*
 EDUCATIONAL BIAS MODE

 The selected color receives 12%.

 The remaining 88% is distributed equally
 among the other five colors.

 88 / 5 = 17.6%

 IMPORTANT:
 This is an explicit simulation of probability bias.
 It is not connected to a real gambling system.
*/

const SELECTED_PROBABILITY = 0.12;


let selectedColor = null;
let biasedMode = false;

let rounds = 0;
let balance = 1000;

let spinning = false;


/*
 Count how many times each color appeared.

 Each round produces THREE results,
 so after 100 rounds we have 300 box results.
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

const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");
const box3 = document.getElementById("box3");

const boxes = [
    box1,
    box2,
    box3
];

const spinButton =
    document.getElementById("spinButton");

const modeButton =
    document.getElementById("modeButton");

const balanceElement =
    document.getElementById("balance");

const roundsElement =
    document.getElementById("rounds");

const resultElement =
    document.getElementById("result");

const selectedColorElement =
    document.getElementById("selectedColor");

const fairProbabilityElement =
    document.getElementById("fairProbability");

const biasedProbabilityElement =
    document.getElementById("biasedProbability");

const statsGrid =
    document.getElementById("statsGrid");


/*
==========================================================
 CREATE STATISTIC CARDS
==========================================================
*/

function createStatistics() {

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

createStatistics();


/*
==========================================================
 SELECT COLOR
==========================================================
*/

const colorButtons =
    document.querySelectorAll(".color-option");

colorButtons.forEach(button => {

    button.addEventListener("click", () => {

        colorButtons.forEach(
            item => item.classList.remove("active")
        );

        button.classList.add("active");

        selectedColor =
            button.dataset.color;

        selectedColorElement.textContent =
            NAMES[selectedColor];

        updateComparison();

    });

});


/*
==========================================================
 PROBABILITY TABLE
==========================================================
*/

function getProbabilities() {

    if (!biasedMode || !selectedColor) {

        return {
            ...FAIR
        };

    }


    const result = {};

    const remainingProbability =
        (1 - SELECTED_PROBABILITY) / 5;


    COLORS.forEach(color => {

        if (color === selectedColor) {

            result[color] =
                SELECTED_PROBABILITY;

        } else {

            result[color] =
                remainingProbability;

        }

    });


    return result;

}


/*
==========================================================
 RANDOM COLOR
==========================================================
*/

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


    return COLORS[COLORS.length - 1];

}


/*
==========================================================
 APPLY COLOR TO BOX
==========================================================
*/

function showColor(box, color) {

    const styles = {

        red: {
            background:
                "radial-gradient(circle,#ff7390,#8c1535)",
            shadow:
                "0 0 45px rgba(255,69,109,.6)"
        },

        blue: {
            background:
                "radial-gradient(circle,#72aaff,#174ca4)",
            shadow:
                "0 0 45px rgba(76,141,255,.6)"
        },

        green: {
            background:
                "radial-gradient(circle,#72f7ae,#147346)",
            shadow:
                "0 0 45px rgba(66,223,145,.6)"
        },

        yellow: {
            background:
                "radial-gradient(circle,#ffea88,#a57600)",
            shadow:
                "0 0 45px rgba(255,211,79,.6)"
        },

        purple: {
            background:
                "radial-gradient(circle,#d19cff,#6421a8)",
            shadow:
                "0 0 45px rgba(173,103,255,.6)"
        },

        orange: {
            background:
                "radial-gradient(circle,#ffb478,#a43e0e)",
            shadow:
                "0 0 45px rgba(255,146,77,.6)"
        }

    };


    box.style.background =
        styles[color].background;

    box.style.boxShadow =
        styles[color].shadow;

    box.innerHTML = `
        <span
            style="
                color:white;
                text-shadow:
                    0 2px 15px rgba(0,0,0,.5);
            ">
            ${NAMES[color][0]}
        </span>
    `;

}


/*
==========================================================
 RESET BOXES
==========================================================
*/

function resetBoxes() {

    boxes.forEach(box => {

        box.classList.remove("spinning");

        box.style.background =
            "linear-gradient(145deg,#2a2a43,#10101b)";

        box.style.boxShadow =
            "inset 0 1px rgba(255,255,255,.12)";

        box.innerHTML =
            "<span>?</span>";

    });

}


/*
==========================================================
 SPIN
==========================================================
*/

spinButton.addEventListener(
    "click",
    () => spin()
);


async function spin() {

    if (spinning) {
        return;
    }

    spinning = true;

    spinButton.disabled = true;

    resultElement.className = "result";
    resultElement.textContent =
        "SPINNING...";


    boxes.forEach(box => {

        box.classList.add("spinning");

    });


    /*
    Generate outcomes BEFORE animation ends.
    */

    const results = [

        randomColor(),
        randomColor(),
        randomColor()

    ];


    await wait(700);


    for (
        let i = 0;
        i < boxes.length;
        i++
    ) {

        boxes[i].classList.remove(
            "spinning"
        );

        showColor(
            boxes[i],
            results[i]
        );

        await wait(200);

    }


    processResults(results);


    spinning = false;

    spinButton.disabled = false;

}


/*
==========================================================
 PROCESS RESULT
==========================================================
*/

function processResults(results) {

    rounds++;

    roundsElement.textContent =
        rounds;


    /*
    Count the three boxes.
    */

    results.forEach(color => {

        counts[color]++;

    });


    /*
    Educational points system.

    This is NOT real money.

    +10 points per appearance
    -5 if selected color doesn't appear
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

            resultElement.className =
                "result win";

            resultElement.textContent =
                `${NAMES[selectedColor]} APPEARED ${matches} TIME${matches === 1 ? "" : "S"} • +${points} PTS`;

        } else {

            balance -= 5;

            resultElement.className =
                "result loss";

            resultElement.textContent =
                `${NAMES[selectedColor]} DID NOT APPEAR • -5 PTS`;

        }

    } else {

        resultElement.textContent =
            results
                .map(color => NAMES[color])
                .join(" • ");

    }


    balanceElement.textContent =
        balance.toLocaleString();


    updateStatistics();

}


/*
==========================================================
 UPDATE STATISTICS
==========================================================
*/

function updateStatistics() {

    const totalBoxes =
        rounds * 3;


    COLORS.forEach(color => {

        let actualPercentage = 0;


        if (totalBoxes > 0) {

            actualPercentage =
                (
                    counts[color] /
                    totalBoxes
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
            `${actualPercentage.toFixed(2)}%`;


        fill.style.width =
            `${Math.min(actualPercentage,100)}%`;


        /*
        Theoretical probability.
        */

        const probabilities =
            getProbabilities();

        const theoretical =
            probabilities[color] * 100;


        theory.textContent =
            `Theoretical: ${theoretical.toFixed(2)}%`;

    });

}


/*
==========================================================
 MODE BUTTON
==========================================================
*/

modeButton.addEventListener(
    "click",
    () => {

        biasedMode =
            !biasedMode;


        if (biasedMode) {

            modeButton.textContent =
                "SELECTED-COLOR BIAS";

            modeButton.classList.add(
                "bias"
            );

            resultElement.textContent =
                "BIAS MODE ENABLED";

        } else {

            modeButton.textContent =
                "FAIR MODE";

            modeButton.classList.remove(
                "bias"
            );

            resultElement.textContent =
                "FAIR MODE ENABLED";

        }


        updateComparison();

        updateStatistics();

    }
);


/*
==========================================================
 COMPARISON PANEL
==========================================================
*/

function updateComparison() {

    const fairPercent =
        100 / 6;

    fairProbabilityElement.textContent =
        `${fairPercent.toFixed(2)}%`;


    if (!selectedColor) {

        biasedProbabilityElement.textContent =
            `${(SELECTED_PROBABILITY * 100).toFixed(2)}%`;

        return;

    }


    biasedProbabilityElement.textContent =
        `${(SELECTED_PROBABILITY * 100).toFixed(2)}%`;

}


/*
==========================================================
 MASS SIMULATION
==========================================================
*/

function runSimulation(numberOfRounds) {

    /*
    Temporarily generate large numbers of
    outcomes without animation.
    */

    for (
        let i = 0;
        i < numberOfRounds;
        i++
    ) {

        const results = [

            randomColor(),
            randomColor(),
            randomColor()

        ];


        results.forEach(color => {

            counts[color]++;

        });

    }


    rounds += numberOfRounds;

    roundsElement.textContent =
        rounds;


    updateStatistics();

}


/*
==========================================================
 MASS SIMULATION BUTTONS
==========================================================
*/

document
    .getElementById("run100Button")
    .addEventListener(
        "click",
        () => runSimulation(100)
    );


document
    .getElementById("run1000Button")
    .addEventListener(
        "click",
        () => runSimulation(1000)
    );


/*
==========================================================
 RESET
==========================================================
*/

document
    .getElementById("resetButton")
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


    colorButtons.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    selectedColorElement.textContent =
        "NONE";


    modeButton.textContent =
        "FAIR MODE";

    modeButton.classList.remove(
        "bias"
    );


    balanceElement.textContent =
        "1000";

    roundsElement.textContent =
        "0";


    resultElement.className =
        "result";

    resultElement.textContent =
        "READY";


    resetBoxes();

    updateComparison();

    updateStatistics();

}


/*
==========================================================
 DELAY
==========================================================
*/

function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );

}


/*
 INITIALIZE
*/

resetSimulation();

