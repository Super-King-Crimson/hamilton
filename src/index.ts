import { exit } from "node:process";
import { createServer } from "node:http";
import route from "./route.js";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

async function start(): Promise<number> {
    const server = createServer(route);

    server.listen(PORT);

    server.once("listening", () => console.log(`Now listening at ${HOSTNAME}:${PORT}`));

    return new Promise((resolve) => {
        server.once("close", () => resolve(0));

        server.once("error", (err) => {
            console.log("Server shut down with the following error:");
            console.log(`${err.name}: ${err.message}`);
            resolve(1);
        });
    });
}

start().then((exitCode) => exit(exitCode));
