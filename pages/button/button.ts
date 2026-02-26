const Header: HTMLHeadingElement = document.querySelector("h1")!;
const PlusButton: HTMLButtonElement = document.querySelector("#plus")!;
const ResetButton: HTMLButtonElement = document.querySelector("#reset")!;

class Signal<T> {
    private _value: T;
    private _callbacks: ((newValue: T, oldValue?: T) => void)[] = [];

    constructor(value: T) {
        this._value = value;
    }

    on(f: (newValue: T, oldValue?: T) => void) {
        this._callbacks.push(f);
    }

    map(f: (value: T) => T) {
        this.set(f(this.get()));
    }

    set(value: T) {
        const oldValue = this._value;
        this._value = value;

        for (const cb of this._callbacks) {
            setTimeout(() => cb(this._value, oldValue), 0)
        }
    }

    get(): T { return this._value; }
}

let count = new Signal(0);
count.on(newValue => Header.textContent = `You have clicked the button ${newValue} times.`)

PlusButton.addEventListener("click", () => count.map(v => v + 1))
ResetButton.addEventListener("click", () => count.set(0))

count.set(0);
