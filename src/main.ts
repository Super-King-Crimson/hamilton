import { exit } from "node:process";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const HOSTNAME = "127.0.0.1";
const PORT = 3000;

async function start(): Promise<number> {
    const server = createServer((req, res) => {
        switch (req.url) {
            case "/":
                res.writeHead(200, { "content-type": "text/html" });
                res.end(readFileSync("pages/index.html"));
                break;
            case "/button":
                res.writeHead(200, { "content-type": "text/html" });
                res.end(readFileSync("pages/button/button.html"));
                break;
            case "/button.js":
                res.writeHead(200, { "content-type": "text/javascript" });
                res.end(readFileSync("pages/scripts/button/button.js"));
                break;
            default:
                console.log(req.url);
                res.writeHead(404, { "content-type": "text/html" });
                res.end("<h1>Page not found</h1>");
                break;
        }
    });

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
