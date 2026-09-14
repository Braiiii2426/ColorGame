
"use strict";

/*
=========================================================
 COLOR CARNIVAL
 Educational probability experiment

 6 COLORS
 3 BOXES
 FAIR MODE
 BIAS MODE
 MULTIPLE COLOR SELECTION
=========================================================
*/


/* =======================================================
   COLORS
======================================================= */

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


/* =======================================================
   VARIABLES
======================================================= */

/*
    IMPORTANT:
    This is now an ARRAY instead of a single color.

    Example:
    ["red", "blue", "purple"]
*/

let selectedColors = [];

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


/* =======================================================
   DOM ELEMENTS
======================================================= */

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


/* =======================================================
   CREATE STATISTICS
======================================================= */

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


/* =======================================================
   GET PROBABILITIES
======================================================= */

function getProbabilities() {

    /*
        FAIR MODE

        Every color:
        1 / 6 = 16.6667%
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
        BIAS MODE

        For the educational experiment,
        the FIRST selected color receives
        the slider probability.

        The other five colors share
        the remaining probability.

        Example:

        Selected = RED
        Slider = 12%

        RED = 12%
        Other five = 17.6% each
    */

    const targetColor =
        selectedColors[0];


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

        if (color === targetColor) {

            probabilities[color] =
                selectedProbability;

        } else {

            probabilities[color] =
                otherProbability;

        }

    });


    return probabilities;
}


/* =======================================================
   RANDOM COLOR
======================================================= */

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


    /*
        Fallback.
    */

    return COLORS[
        COLORS.length - 1
    ];
}


/* =======================================================
   COLOR VISUALS
======================================================= */

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


/* =======================================================
   SHOW RESULT IN BOX
======================================================= */

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


/* =======================================================
   RESET BOX
======================================================= */

function resetBox(box) {

    box.style.background =
        "linear-gradient(145deg,#9562b9,#50246d)";


    box.style.boxShadow =
        `
        inset 0 5px 0 rgba(255,255,255,.2),
        0 10px 0 #321737,
        0 20px 30px rgba(0,0,0,.3)
        `;


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


/* =======================================================
   SPIN
======================================================= */

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
        Reset boxes.
    */

    boxes.forEach(box => {

        resetBox(box);

        box.classList.add(
            "spinning"
        );

    });


    /*
        Generate three independent
        color results.
    */

    const results = [

        randomColor(),
        randomColor(),
        randomColor()

    ];


    await

