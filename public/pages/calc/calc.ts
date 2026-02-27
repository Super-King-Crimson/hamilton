console.log("Hello, world!");

type Calculation = (a: number, b: number) => number;

// functions
const add: Calculation = (a, b) => a + b;
const subtract: Calculation = (a, b) => a - b;
const multiply: Calculation = (a, b) => a * b;
const divide: Calculation = (a, b) => a / b;

function operateOnInput(a: string, b: string, op: string): [false, 0] | [true, number] {
    let aNum = parseFloat(a);
    let bNum = parseFloat(b);

    if (Number.isNaN(aNum) || Number.isNaN(bNum)) return [false, 0];

    let res;

    if (op === "×") res = multiply(aNum, bNum);
    else if (op === "+") res = add(aNum, bNum);
    else if (op === "-") res = subtract(aNum, bNum);
    else if (op === "÷") res = divide(aNum, bNum);
    else return [false, 0];

    return [true, res];
}

function getSpaceIndicies(str: string) {
    let spaces = [];

    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === " ") {
            spaces.push(i);
        }
    }

    return spaces;
}

// document ish

// max chars that screen can hold
// got empirically, maybe check if there's a way to automatically detect char overflow?
const TEXT_WIDTH = 12;
const DECIMAL_PRECISION = 8;
const buttonsDiv: HTMLDivElement = document.querySelector(".buttons")!;
const screenDiv: HTMLDivElement = document.querySelector(".screen")!;

// what's shown on the screen
let currNum = "0";

// internal handling of calculations
let currCalc = "";

// debounce for clicking operators multiple times in a row
// so user can't do 8 x x x x x x x 5
let canOp = true;

// aka `just-clicked-equals`, allows user to do 8 x 5 = then
// either do something with it by clicking another operator
// or discard it by clicking a number
let overrideRisk = false;

// i didn't want to use regex again it felt like cheating
// returns false if there is nothing to be evaluated, otherwise returns
// the left-to-right evaluation of everything it can
// should be called every operator possible, does not respect PEMDAS
function evaluateInput(): [false, 0] | [true, number] {
    // intentionally put spaces before and after each operator
    let spaces = getSpaceIndicies(currCalc);

    // gets first operation
    let a = currCalc.slice(0, spaces[0]);
    let op = currCalc.charAt(spaces[0] + 1);
    let b = currCalc.slice(spaces[1] + 1, spaces[2]);

    let [success, res] = operateOnInput(a, b, op);

    if (!success) return [false, 0];

    // organization: x_+_y_+_z (the underscores represent spaces)
    // operator will always be immediately after space[i]
    // second number will always be between space[i+1] to space[i+2]
    let i = 2;
    // walks thru string and evaluates it IN ORDER until it can't solve no more
    while (true) {
        op = currCalc.charAt(spaces[i] + 1);
        b = currCalc.slice(spaces[i + 1] + 1, spaces[i + 2]);

        const [success, tmp] = operateOnInput(res.toString(), b, op);
        if (!success) break;

        res = tmp;
        i += 2;
    }

    return [true, res];
}

buttonsDiv.addEventListener("click", (e: any) => {
    const target: HTMLElement = e.target;

    if (target.tagName.toLowerCase() !== "button") return;

    const buttonText = target.innerText.toLowerCase();

    // OPERATOR BUTTONS
    if (
        buttonText === "%" ||
        buttonText === "×" ||
        buttonText === "+" ||
        buttonText === "÷" ||
        buttonText === "-" ||
        buttonText === "="
    ) {
        if (overrideRisk) {
            if (buttonText === "=") return;
            else if (canOp) overrideRisk = false;
        }

        if (!canOp) return;

        canOp = false;

        // add space so there's something else for evaluateInput to match until
        // this is required for evaluateInput to work properly
        currCalc += currNum + " ";

        // don't you love functions with side effects
        let [success, res] = evaluateInput();
        // deletes trailing 0s
        let result = parseFloat(res.toFixed(DECIMAL_PRECISION)).toString();

        if (success) {
            currNum = result;
            currCalc = currNum + " ";
        }

        if (buttonText === "%") {
            currCalc += "÷ 100 × ";
        } else if (buttonText === "=") {
            // if the equation succeeds when the user clicks =
            // then currCalc will be overriden to be the result of that
            // the only way for a non-success to happen on an equal sign press is if user types x =
            // so therefore, just save the number internally and allow them to chain operators off it
            // eg. 3 =(3) * 5(15) + 7 =(22)
            canOp = true;
            if (currNum !== "") {
                currCalc = currNum;
            }

            // however set overrideRisk (aka just-clicked-equals) so user CANNOT do
            // 3 = 3 * 5 = = to add extra spaces and ruin currCalc's spacing
            overrideRisk = true;
        } else {
            currCalc += buttonText + " ";
        }

        if (success) {
            if (buttonText === "=") {
                // override i mentioned earlier
                currCalc = result;
            }

            // display to screen briefly so user can see it
            screenDiv.textContent = result.slice(0, TEXT_WIDTH);
        }

        currNum = "";
    } else {
        // SPECIAL BUTTONS THAT AREN'T REALLY OPERATORS
        if (buttonText === "±") {
            // because we parseInt, adding/removing this dash is all we have to do to register something as a negative
            // no internal checking required!
            if (currNum.charAt(0) == "-") currNum = currNum.replace("-", "");
            else currNum = "-" + currNum;
        } else if (buttonText === "c") {
            currNum = currNum.slice(0, currNum.length - 1);
        } else if (buttonText === "ac") {
            currCalc = "";
            currNum = "";
        } else {
            if (buttonText == "." && currNum.includes(".")) return;
            // EVERYTHING ELSE
            canOp = true;

            if (overrideRisk) {
                overrideRisk = false;
                currCalc = "";
            }

            if (currNum === "0" && buttonText === "0") return;

            currNum = currNum === "0" ? buttonText : currNum + buttonText;
        }

        if (currNum === "") currNum = "0";
        screenDiv.textContent = currNum.slice(-1 * TEXT_WIDTH);
    }
});

// alert(`3 * 5 = ${operate(3, 5, "mul")}`);
// alert(`10 / 2  = ${operate(10, 2, "div")}`);
