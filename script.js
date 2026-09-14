```javascript
document.addEventListener("DOMContentLoaded", function () {

    const spinButton = document.getElementById("spinButton");
    const result = document.getElementById("result");

    const boxes = [
        document.getElementById("box1"),
        document.getElementById("box2"),
        document.getElementById("box3")
    ];

    console.log("Color Carnival JavaScript loaded.");

    if (!spinButton || !result || boxes.includes(null)) {
        console.error("ERROR: Required HTML elements were not found.");
        return;
    }

    spinButton.addEventListener("click", function () {

        console.log("SPIN BUTTON CLICKED");

        result.textContent = "SPINNING...";

        boxes.forEach(function (box) {
            box.classList.add("spinning");
        });

        setTimeout(function () {

            boxes.forEach(function (box, index) {

                const colors = [
                    "#ff416c",
                    "#4788ff",
                    "#30ca82",
                    "#f2cc3c",
                    "#a050db",
                    "#f18038"
                ];

                const randomColor =
                    colors[Math.floor(Math.random() * colors.length)];

                box.style.background = randomColor;

                box.innerHTML = `
                    <div class="box-top">
                        ${index + 1}
                    </div>

                    <div class="box-inside">
                        ●
                    </div>
                `;

                box.classList.remove("spinning");
            });

            result.textContent = "SPIN COMPLETE!";

        }, 1000);

    });

});
```
