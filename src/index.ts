import { exit } from "node:process";
import { createServer } from "node:http";
import route from "./route.js";
import { Logger, LogLevel } from "./logger.js";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

async function start(): Promise<number> {
    const server = createServer(route);
    const logger = new Logger(LogLevel.Debug);

    server.listen(PORT);

    server.once("listening", () => logger.log(`Now listening at ${HOSTNAME}:${PORT}`, LogLevel.Info));

    return new Promise((resolve) => {
        server.once("close", () => resolve(0));

        server.once("error", (err) => {
            logger.log("Server shut down with the following error:", LogLevel.Error);
            logger.log(`${err.name}: ${err.message}`, LogLevel.Error);
            resolve(1);
        });
    });
}

start().then((exitCode) => exit(exitCode));
