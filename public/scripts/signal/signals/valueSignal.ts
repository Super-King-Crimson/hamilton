import { Signal } from "../signal.js";

export class ValueSignal<T> extends Signal<[T, T]> {
    private _value: T;

    constructor(value: T) {
        super();
        this._value = value;
    }

    get(): T { return this._value; }

    set(value: T) {
        const oldValue = this._value;
        this._value = value;

        this.fire(this._value, oldValue);
    }

    map(f: (value: T) => T) { this.set(f(this.get())); }
}
