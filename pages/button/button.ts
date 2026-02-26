const Header: HTMLHeadingElement = document.querySelector("h1")!;
const PlusButton: HTMLButtonElement = document.querySelector("#plus")!;
const ResetButton: HTMLButtonElement = document.querySelector("#reset")!;

let count = 0;

function updateText() {
    Header.textContent = `You have clicked the button ${count} times.`;
}

PlusButton.addEventListener("click", () => {
    count++;
    updateText();
})

ResetButton.addEventListener("click", () => {
    count = 0;
    updateText();
})

updateText();
