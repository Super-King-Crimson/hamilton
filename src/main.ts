import { exit } from "node:process";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

async function start(): Promise<number> {
    const server = createServer((_, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(readFileSync("pages/index.html"));
    });

    return new Promise((resolve) => {
        server.listen(PORT)
            .once("listening", () => console.log(`Now listening at ${HOSTNAME}:${PORT}`))
            .once("close", () => resolve(0))
            .once("error", (err) => {
                console.log("Server shut down with the following error:");
                console.log(`${err.name}: ${err.message}`);
                resolve(1);
            });
    });
}

start().then((exitCode) => exit(exitCode));
