export type WatcherCallback<T extends any[]> = (...args: T) => void;

export class Signal<T extends any[]> {
    protected _watchers: Watcher<T>[] = [];
    protected _closed = false;

    constructor() { }

    private _addWatcher(watcher: Watcher<T>): number {
        const id = this._watchers.length;

        this._watchers.push(watcher);

        return id;
    }

    on(f: WatcherCallback<T>): number {
        return this._addWatcher(new Watcher(f));
    }

    once(f: WatcherCallback<T>): number {
        return this._addWatcher(new OnceWatcher(f));
    }

    fire(...args: T) {
        for (const watcher of this._watchers) {
            setTimeout(() => watcher.invoke(...args), 0);
        }
    }

    close() {
        for (const watcher of this._watchers) {
            watcher.close()
        }

        this._watchers = [];
        this._closed = true;
    }

    isClosed() { return this._closed; }
}

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

export class Watcher<T extends any[]> {
    private _onFired: Maybe<WatcherCallback<T>>;
    private _watching: boolean = true;

    constructor(f: WatcherCallback<T>) {
        this._onFired = f;
    }

    isWatching(): boolean { return this._watching; }

    close() {
        this._watching = false;
        this._onFired = undefined;
    }

    invoke(...args: T) {
        if (this._watching && this._onFired !== undefined) {
            this._onFired(...args);
        }
    }
}

export class OnceWatcher<T extends any[]> extends Watcher<T> {
    constructor(f: WatcherCallback<T>) {
        const newF: WatcherCallback<T> = (...args: T) => {
            f(...args);
            this.close();
        }

        super(newF);
    }
}
