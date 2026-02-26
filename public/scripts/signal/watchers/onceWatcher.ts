import { Watcher, type WatcherCallback } from "../watcher.js";

export class OnceWatcher<T extends any[]> extends Watcher<T> {
    constructor(f: WatcherCallback<T>) {
        const newF: WatcherCallback<T> = (...args: T) => {
            f(...args);
            this.close();
        }

        super(newF);
    }
}
