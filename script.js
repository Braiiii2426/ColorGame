
"use strict";

/*
=========================================================
 COLOR CARNIVAL
 Educational probability experiment

 - 6 colors
 - 3 boxes
 - Multiple color selection
 - Fair probability
 - Educational bias mode
 - Simulation statistics
=========================================================
*/


/* =========================================================
   COLORS
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


/*
    Multiple selections are stored here.

    Examples:

    []
    ["red"]
    ["red", "blue"]
    ["red", "blue", "purple"]
*/

let selectedColors = [];

let biasedMode = false;

let spinning = false;

let rounds = 0;

let balance = 1000;


/* =========================================================
   STATISTICS
========================================================= */

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
   STATISTICS CARDS
========================================================= */

function createStats() {

    statsGrid.innerHTML = "";


    COLORS.forEach(color => {

        const card =
            document.createElement("div");


        card.className =
            "stat";


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


/* =========================================================
   PROBABILITIES
========================================================= */

function getProbabilities() {

    /*
        FAIR MODE

        6 colors:
        16.666...% each
    */

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
        EDUCATIONAL BIAS MODE

        The FIRST selected color is used
        as the target color.

        Example:

        RED + BLUE + PURPLE selected

        RED becomes the target.

        If slider = 12%:

        RED     = 12%
        BLUE    = 17.6%
        GREEN   = 17.6%
        YELLOW  = 17.6%
        PURPLE  = 17.6%
        ORANGE  = 17.6%

        This is for probability education.
    */

    const targetColor =
        selectedColors[0];


    const targetPercent =
        Number(slider.value);


    const targetProbability =
        targetPercent / 100;


    const remaining =
        1 - targetProbability;


    const otherProbability =
        remaining / 5;


    const probabilities = {};


    COLORS.forEach(color => {

        if (
            color === targetColor
        ) {

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


    let cumulative =
        0;


    for (
        const color of COLORS
    ) {

        cumulative +=
            probabilities[color];


        if (
            random < cumulative
        ) {

            return color;

        }

    }


    /*
        Fallback.
    */

    return COLORS[
        COLORS.length - 1
    ];
}


/* =========================================================
   BOX COLORS
========================================================= */

const boxColors = {

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
   SHOW RESULT IN BOX
========================================================= */

function showBox(box, color) {

    const style =
        boxColors[color];


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


    /*
        Start box animation.
    */

    boxes.forEach(box => {

        resetBox(box);

        box.classList.add(
            "spinning"
        );

    });


    /*
        Generate three independent
        random results.
    */

    const results = [

        randomColor(),
        randomColor(),
        randomColor()

    ];


    await delay(900);


    /*
        Reveal them one at a time.
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


        await delay(220);

    }


    processResults(
        results
    );


    spinning = false;


    spinButton.disabled =
        false;
}


/* =========================================================
   PROCESS RESULT
========================================================= */

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
        Multiple selected colors.

        Example:

        Selected:
        RED, BLUE, PURPLE

        Result:
        RED, GREEN, BLUE

        Match:
        RED + BLUE
    */

    if (
        selectedColors.length > 0
    ) {

        const matches =
            results.filter(
                color =>
                    selectedColors.includes(
                        color
                    )
            );


        if (
            matches.length > 0
        ) {

            const uniqueMatches =
                [
                    ...new Set(matches)
                ];


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
                Simulation points only.
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

        /*
            No selected colors.
        */

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


                /*
                    Already selected?
                    Remove it.
                */

                if (
                    selectedColors.includes(
                        color
                    )
                ) {

                    selectedColors =
                        selectedColors.filter(
                            item =>
                                item !== color
                        );


                    this.classList.remove(
                        "active"
                    );

                }


                /*
                    Not selected?
                    Add it.
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
                    Update selected text.
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
   FAIR / BIAS MODE
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
   PROBABILITY SLIDER
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
   STATISTICS
========================================================= */

function updateStats() {

    const totalResults =
        rounds * 3;


    const probabilities =
        getProbabilities();


    COLORS.forEach(color => {

        let actual =
            0;


        if (
            totalResults > 0
        ) {

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


    rounds +=
        amount;


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


    /*
        Reset counters.
    */

    COLORS.forEach(color => {

        counts[color] = 0;

    });


    /*
        Clear color selections.
    */

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

resetSimulation();

