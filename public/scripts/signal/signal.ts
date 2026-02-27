import { type WatcherCallback, Watcher, OnceWatcher } from "./watcher.js";

export class Signal<T extends any[]> {
    protected _watchers: Watcher<T>[] = [];
    protected _deferredWatchers: Watcher<T>[] = [];
    protected _closed = false;

    constructor() { }

    private _addWatcher(watcher: Watcher<T>, list: Watcher<T>[]): Watcher<T> {
        list.push(watcher);

        return watcher;
    }

    on(f: WatcherCallback<T>): Watcher<T> {
        return this._addWatcher(new Watcher(f), this._watchers);
    }

    once(f: WatcherCallback<T>): Watcher<T> {
        return this._addWatcher(new OnceWatcher(f), this._watchers);
    }

    defer(f: WatcherCallback<T>): Watcher<T> {
        return this._addWatcher(new Watcher(f), this._deferredWatchers);
    }

    deferOnce(f: WatcherCallback<T>): Watcher<T> {
        return this._addWatcher(new OnceWatcher(f), this._deferredWatchers);
    }

    fire(...args: T) {
        const promises = this._watchers.map(watcher => watcher.invoke(...args));

        Promise.allSettled(promises).then(() => this._deferredWatchers.map(deferredWatcher => deferredWatcher.invoke(...args)));
    }

    async until(): Promise<T> {
        return new Promise((resolve) => {
            this.once((...args) => resolve(args));
        });
    }

    close() {
        for (const watcher of this._watchers) {
            watcher.close()
        }

        for (const watcher of this._deferredWatchers) {
            watcher.close()
        }

        this._watchers = [];
        this._closed = true;
    }

    isClosed() { return this._closed; }
}
