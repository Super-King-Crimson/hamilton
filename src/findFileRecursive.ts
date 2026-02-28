import { existsSync, readdirSync } from "node:fs";
import { Queue } from "./queue.js";
import { Logger, LogLevel } from "./logger.js";

const logger = new Logger(LogLevel.Standard);

export function findFileRecursive(path: string, head: string, ignore?: string[]): Maybe<string> {
    const q = new Queue<string>();

    if (!existsSync(path)) {
        logger.log("Couldn't find path " + path);
        return undefined;
    }

    q.enqueue(path);

    while (!q.isEmpty()) {
        const dir = q.dequeue()!;
        const attempt = `${dir}/${head}`;

        logger.log("attempting to find at " + attempt);

        if (existsSync(attempt)) {
            logger.log("found at " + attempt + "\n");
            return attempt;
        } else {
            logger.log("failed. attempting the following subdirs:");
            for (const dirent of readdirSync(dir, { withFileTypes: true })) {
                const toAdd = dirent.name;

                if (dirent.isDirectory()) {

                    if (ignore && ignore.some((dirName) => dirName === toAdd)) {
                        logger.log(`   skipping ${dir}/${toAdd} as it is in the exclude list`);
                    } else {
                        q.enqueue(`${dir}/${toAdd}`);
                        logger.log(`   ADDING: ${dir}/${toAdd}`);
                    }
                } else {
                    logger.log(`   skipping ${dir}/${toAdd} as it is not a dir`);
                }
            }
        }
    }

    logger.log("failed to find\n");
    return undefined
}
