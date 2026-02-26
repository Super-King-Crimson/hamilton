import { ValueSignal } from "../scripts/signal/index.js";
import untilDraw from "../scripts/untilDraw.js";

const Header: HTMLHeadingElement = document.querySelector("h1")!;
const PlusButton: HTMLButtonElement = document.querySelector("#plus")!;
const ResetButton: HTMLButtonElement = document.querySelector("#reset")!;

let count = new ValueSignal(0);

count.on(async newValue => {
    Header.textContent = `You have clicked the button ${newValue} times.`;
    await untilDraw();
});

count.on(val => val === 1 ? console.log("Step 1") : undefined);

count.defer(newValue => {
    if (newValue >= 10) {
        alert("You win!");
        count.close();
    }
});

PlusButton.addEventListener("click", () => count.map(v => v + 1))
ResetButton.addEventListener("click", () => count.set(0))
count.set(0);
