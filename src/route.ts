import { existsSync, readFileSync } from "node:fs";
import type { RequestListener, IncomingMessage, ServerResponse } from "node:http";
import { basename, extname } from "node:path";
import { findFileRecursive } from "./findFileRecursive.js";
import { Logger, LogLevel } from "./logger.js";

export default route as RequestListener;

const DIR_PUBLIC = "public";
const DIR_PAGES = "pages";
const DIR_SCRIPTS = "scripts";

const PATH_PUBLIC = DIR_PUBLIC;
const PATH_PAGES = `${DIR_PUBLIC}/${DIR_PAGES}`;

const PATH_SCRIPTS = `${DIR_PUBLIC}/dist/${DIR_SCRIPTS}`;
const PATH_PAGE_SCRIPTS = `${DIR_PUBLIC}/dist/${DIR_PAGES}`;

const OK_200 = 200;
const NOT_FOUND_404 = 404;

const logger = new Logger(LogLevel.Standard);

function sendResponseFile(res: ServerResponse<IncomingMessage>, contentType: string, filePath: string) {
    const fileData = readFileSync(filePath)

    res.writeHead(OK_200, { "content-type": contentType });
    res.end(fileData);
}

function sendPlainTextError(res: ServerResponse<IncomingMessage>, url: string) {
    res.writeHead(NOT_FOUND_404, { "content-type": "text/plain" });
    res.end("404: could not find resource at " + url);
}

function sendHtmlError(res: ServerResponse<IncomingMessage>, url: string) {
    res.writeHead(NOT_FOUND_404, { "content-type": "text/html" });
    res.end(`<h1>Path ${url} not found</h1>`);
}

function getJsPath(path: string): Maybe<string> {
    if (path.includes(DIR_SCRIPTS)) {
        return findFileRecursive(PATH_SCRIPTS, basename(path));
    } else {
        return findFileRecursive(PATH_PAGE_SCRIPTS, basename(path));
    }

}

function getHtmlPath(path: string): Maybe<string> {
    if (path === "/" || path === "/index") return `${PATH_PAGES}/index.html`;

    // get rid of leading '/'
    path = path.slice(1);

    let htmlPath;

    const att1 = `${path}/index.html`;
    logger.log("att1: " + att1);
    if ((htmlPath = findFileRecursive(PATH_PAGES, att1)) !== undefined) {
        return htmlPath;
    }

    const tail = basename(path);
    const att2 = `${tail}/${tail}.html`;

    logger.log("att2: " + att2);

    if ((htmlPath = findFileRecursive(PATH_PAGES, att2)) !== undefined) {
        return htmlPath;
    }

    return undefined;
}

function routeUrl(res: ServerResponse<IncomingMessage>, url: string) {
    logger.log(`User requested ${url}`);

    const ext = extname(url);
    let route;

    if (ext === ".js" && (route = getJsPath(url)) !== undefined) {
        return sendResponseFile(res, "text/javascript", route);
    }

    if (ext === ".css") {
        if (url === "/styles.css") {
            return sendResponseFile(res, "text/css", `${PATH_PAGES}/styles.css`);
        }

        const bareName = basename(url, ".css");

        let path;
        if (existsSync((path = `${PATH_PAGES}/${bareName}/${bareName}.css`))) {
            return sendResponseFile(res, "text/css", path);
        }
    }

    if (ext === ".html" || ext === "") {
        const arg = ext === ".html" ?
            url.slice(0, -5) : url;

        if ((route = getHtmlPath(arg)) !== undefined) {
            return sendResponseFile(res, "text/html", route);
        }

        return sendHtmlError(res, url);
    }

    sendPlainTextError(res, url);
}

function route(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
    const url = req.url;

    if (url !== undefined) {
        routeUrl(res, url);
    }
}
