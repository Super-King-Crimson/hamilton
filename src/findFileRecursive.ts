import { existsSync, readdirSync } from "node:fs";
import { Queue } from "./queue.js";

export function findFileRecursive(path: string, head: string, ignore?: string[]): Maybe<string> {
    const q = new Queue<string>();

    if (!existsSync(path)) {
        console.log("Couldn't find path ", path);
        return undefined;
    }

    q.enqueue(path);

    while (!q.isEmpty()) {
        const dir = q.dequeue()!;
        const attempt = `${dir}/${head}`;

        console.log("attempting to find at " + attempt);

        if (existsSync(attempt)) {
            console.log("found at " + attempt + "\n");
            return attempt;
        } else {
            console.log("failed. attempting the following subdirs:");
            for (const dirent of readdirSync(dir, { withFileTypes: true })) {
                const toAdd = dirent.name;

                if (dirent.isDirectory()) {

                    if (ignore && ignore.some((dirName) => dirName === toAdd)) {
                        console.log(`   skipping ${dir}/${toAdd} as it is in the exclude list`);
                    } else {
                        q.enqueue(`${dir}/${toAdd}`);
                        console.log(`   ADDING: ${dir}/${toAdd}`);
                    }
                } else {
                    console.log(`   skipping ${dir}/${toAdd} as it is not a dir`);
                }
            }
        }
    }

    console.log("failed to find\n");
    return undefined
}
