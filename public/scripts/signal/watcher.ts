export type WatcherCallback<T extends any[]> = (...args: T) => void | Promise<void>;

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

    async invoke(...args: T) {
        if (this._watching && this._onFired !== undefined) {
            return this._onFired(...args);
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
