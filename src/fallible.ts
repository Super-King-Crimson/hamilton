export function fallible<T, E = Error>(f: () => T): Fallible<T, E> {
    try {
        const value: T = f();

        if (typeof value === "number" && Number.isNaN(value)) {
            throw new Error("value was NaN");
        }

        return [value, null];
    } catch (error) {
        return [null, error as E];
    }
}

export async function falliblePromise<T, E = Error>(f: () => Promise<T>): Promise<[T, null] | [null, E]> {
    try {
        const data: T = await f();

        return [data, null];
    } catch (error) {
        return [null, error as E];
    }
}
