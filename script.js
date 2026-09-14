"use strict";

document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       COLORS
    ============================== */

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


    /* ==============================
       VARIABLES
    ============================== */

    let selectedColors = [];
    let spinning = false;
    let biasedMode = false;

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


    /* ==============================
       GET ELEMENTS
    ============================== */

    const boxArea = document.getElementById("boxArea");

    const boxes = [
        document.getElementById("box1"),
        document.getElementById("box2"),
        document.getElementById("box3")
    ];

    const spinButton = document.getElementById("spinButton");
    const separateButton = document.getElementById("separateButton");
    const modeButton = document.getElementById("modeButton");

    const result = document.getElementById("result");
    const balanceElement = document.getElementById("balance");
    const roundsElement = document.getElementById("rounds");

    const selectedColorElement =
        document.getElementById("selectedColor");

    const slider =
        document.getElementById("probabilitySlider");

    const probabilityValue =
        document.getElementById("probabilityValue");

    const statsGrid =
        document.getElementById("statsGrid");


    /* ==============================
       CHECK HTML
    ============================== */

    if (
        !boxArea ||
        boxes.includes(null) ||
        !spinButton ||
        !separateButton ||
        !modeButton ||
        !result ||
        !balanceElement ||
        !roundsElement ||
        !selectedColorElement ||
        !slider ||
        !probabilityValue ||
        !statsGrid
    ) {

        console.error(
            "Color Carnival: One or more HTML elements are missing."
        );

        return;
    }


    /* ==============================
       STATISTICS
    ============================== */

    function createStats() {

        statsGrid.innerHTML = "";

        COLORS.forEach(function (color) {

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


    /* ==============================
       PROBABILITY
    ============================== */

    function getProbabilities() {

        /* FAIR */

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


        /* EDUCATIONAL BIAS */

        const target =
            selectedColors[0];

        const targetProbability =
            Number(slider.value) / 100;

        const otherProbability =
            (1 - targetProbability) / 5;

        return {

            red:
                target === "red"
                    ? targetProbability
                    : otherProbability,

            blue:
                target === "blue"
                    ? targetProbability
                    : otherProbability,

            green:
                target === "green"
                    ? targetProbability
                    : otherProbability,

            yellow:
                target === "yellow"
                    ? targetProbability
                    : otherProbability,

            purple:
                target === "purple"
                    ? targetProbability
                    : otherProbability,

            orange:
                target === "orange"
                    ? targetProbability
                    : otherProbability
        };
    }


    /* ==============================
       RANDOM COLOR
    ============================== */

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

        return "orange";
    }


    /* ==============================
       BOX COLOR
    ============================== */

    const visualColors = {

        red: {
            background:
                "#df315d",

            shadow:
                "0 0 30px rgba(223,49,93,.55)"
        },

        blue: {
            background:
                "#4083ed",

            shadow:
                "0 0 30px rgba(64,131,237,.55)"
        },

        green: {
            background:
                "#30c880",

            shadow:
                "0 0 30px rgba(48,200,128,.55)"
        },

        yellow: {
            background:
                "#e9bd2e",

            shadow:
                "0 0 30px rgba(243,201,54,.55)"
        },

        purple: {
            background:
                "#a051d7",

            shadow:
                "0 0 30px rgba(160,81,215,.55)"
        },

        orange: {
            background:
                "#f18038",

            shadow:
                "0 0 30px rgba(241,128,56,.55)"
        }
    };


    /* ==============================
       RESET BOX
    ============================== */

    function resetBox(box) {

        const number =
            box.id.replace("box", "");

        box.classList.remove("spinning");

        box.style.background =
            "linear-gradient(145deg,#9865bc,#51256e)";

        box.style.boxShadow =
            "inset 0 5px 0 rgba(255,255,255,.2), 0 10px 0 #311637, 0 20px 30px rgba(0,0,0,.3)";

        box.innerHTML = `
            <div class="box-top">
                ${number}
            </div>

            <div class="box-inside">
                ?
            </div>
        `;
    }


    /* ==============================
       SHOW RESULT
    ============================== */

    function showBox(box, color) {

        const number =
            box.id.replace("box", "");

        box.classList.remove("spinning");

        box.style.background =
            visualColors[color].background;

        box.style.boxShadow =
            visualColors[color].shadow;

        box.innerHTML = `
            <div class="box-top">
                ${number}
            </div>

            <div class="box-inside">
                ${NAMES[color][0]}
            </div>
        `;
    }


    /* ==============================
       SPIN
    ============================== */

    async function spin() {

        if (spinning) {
            return;
        }

        spinning = true;

        spinButton.disabled = true;

        result.className = "result";

        result.textContent =
            "SPINNING...";


        /* Start animation */

        boxes.forEach(function (box) {

            resetBox(box);

            box.classList.add("spinning");

        });


        /* Generate results */

        const results = [
            randomColor(),
            randomColor(),
            randomColor()
        ];


        /* Animation duration */

        await wait(1000);


        /* Reveal */

        for (let i = 0; i < 3; i++) {

            showBox(
                boxes[i],
                results[i]
            );

            await wait(200);
        }


        /* Count */

        results.forEach(function (color) {

            counts[color]++;

        });


        rounds++;


        /* Selected color matching */

        if (
            selectedColors.length > 0
        ) {

            const matches =
                results.filter(function (color) {

                    return selectedColors.includes(color);

                });


            if (matches.length > 0) {

                const names =
                    [
                        ...new Set(matches)
                    ]
                    .map(function (color) {
                        return NAMES[color];
                    })
                    .join(" + ");


                result.className =
                    "result win";

                result.textContent =
                    names + " APPEARED!";


                balance +=
                    matches.length * 10;

            } else {

                result.className =
                    "result loss";

                result.textContent =
                    "NONE OF YOUR SELECTED COLORS APPEARED";


                balance -= 5;
            }

        } else {

            result.textContent =
                results
                    .map(function (color) {
                        return NAMES[color];
                    })
                    .join(" • ");
        }


        /* Update */

        balanceElement.textContent =
            balance.toLocaleString();

        roundsElement.textContent =
            rounds.toLocaleString();


        updateStats();


        spinning = false;

        spinButton.disabled = false;
    }


    /* ==============================
       MULTIPLE COLOR SELECTION
    ============================== */

    const colorButtons =
        document.querySelectorAll(".color-btn");


    colorButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const color =
                    button.dataset.color;


                const index =
                    selectedColors.indexOf(color);


                /* Remove */

                if (index !== -1) {

                    selectedColors.splice(
                        index,
                        1
                    );

                    button.classList.remove(
                        "active"
                    );

                }

                /* Add */

                else {

                    selectedColors.push(
                        color
                    );

                    button.classList.add(
                        "active"
                    );
                }


                /* Display */

                if (
                    selectedColors.length === 0
                ) {

                    selectedColorElement.textContent =
                        "NONE";

                } else {

                    selectedColorElement.textContent =
                        selectedColors
                            .map(function (item) {
                                return NAMES[item];
                            })
                            .join(", ");
                }


                updateStats();
            }
        );
    });


    /* ==============================
       FAIR / BIAS
    ============================== */

    modeButton.addEventListener(
        "click",
        function () {

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


    /* ==============================
       SLIDER
    ============================== */

    slider.addEventListener(
        "input",
        function () {

            probabilityValue.textContent =
                slider.value;

            updateStats();
        }
    );


    /* ==============================
       SEPARATE BOXES
    ============================== */

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

                separateButton.textContent =
                    "↔ JOIN BOXES";

            } else {

                separateButton.textContent =
                    "↔ SEPARATE BOXES";
            }
        }
    );


    /* ==============================
       RAPID SIMULATION
    ============================== */

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
            amount.toLocaleString() +
            " ROUNDS SIMULATED";


        updateStats();
    }


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


    /* ==============================
       STATISTICS
    ============================== */

    function updateStats() {

        const totalResults =
            rounds * 3;

        const probabilities =
            getProbabilities();


        COLORS.forEach(function (color) {

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
                    color + "Percent"
                );

            const fill =
                document.getElementById(
                    color + "Fill"
                );

            const theory =
                document.getElementById(
                    color + "Theory"
                );


            if (percent) {

                percent.textContent =
                    actual.toFixed(2) + "%";
            }


            if (fill) {

                fill.style.width =
                    Math.min(actual, 100) + "%";
            }


            if (theory) {

                theory.textContent =
                    "Theoretical: " +
                    (
                        probabilities[color] * 100
                    ).toFixed(2) +
                    "%";
            }

        });
    }


    /* ==============================
       RESET
    ============================== */

    document
        .getElementById("reset")
        .addEventListener(
            "click",
            function () {

                rounds = 0;

                balance = 1000;

                selectedColors = [];

                biasedMode = false;


                COLORS.forEach(function (color) {

                    counts[color] = 0;

                });


                colorButtons.forEach(
                    function (button) {

                        button.classList.remove(
                            "active"
                        );

                    }
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
                    function (box) {

                        resetBox(box);

                    }
                );


                updateStats();
            }
        );


    /* ==============================
       DELAY
    ============================== */

    function wait(ms) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    ms
                );

            }
        );
    }


    /* ==============================
       INITIALIZE
    ============================== */

    createStats();

    boxes.forEach(function (box) {
        resetBox(box);
    });

    updateStats();

});

