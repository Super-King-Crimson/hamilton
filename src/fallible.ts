export function fallible<T, E = Error>(f: T): [T, undefined] | [undefined, E] {
    try {
        const value: T = f;

        if (typeof value === "number" && Number.isNaN(value)) {
            throw new Error("value was NaN");
        }

        return [value, undefined];
    } catch (error) {
        return [undefined, error as E];
    }
}

export async function falliblePromise<T, E = Error>(f: () => Promise<T>): Promise<[T, undefined] | [undefined, E]> {
    try {
        const data: T = await f();

        return [data, undefined];
    } catch (error) {
        return [undefined, error as E];
    }
}
