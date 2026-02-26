import { ValueSignal } from "../scripts/signal.js";

const Header: HTMLHeadingElement = document.querySelector("h1")!;
const PlusButton: HTMLButtonElement = document.querySelector("#plus")!;
const ResetButton: HTMLButtonElement = document.querySelector("#reset")!;

let count = new ValueSignal(0);
count.on(newValue => Header.textContent = `You have clicked the button ${newValue} times.`)

PlusButton.addEventListener("click", () => count.map(v => v + 1))
ResetButton.addEventListener("click", () => count.set(0))

count.set(0);
