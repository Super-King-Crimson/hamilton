export enum LogLevel {
    Debug,
    Info,
    Standard,
    Error,
    Silent,
}

export class Logger {
    level: number;

    constructor(level: LogLevel = LogLevel.Standard) {
        this.level = level;
    }

    log(message: string, level: LogLevel = LogLevel.Debug) {
        if (this.level > level) return;
        if (level == LogLevel.Silent) return;

        switch (level) {
            case LogLevel.Error:
                console.error(`ERROR: ${message}`);
                break;
            case LogLevel.Debug:
                console.error(`DEBUG: ${message}`);
                break;
            default:
                console.log(message);
                break;
        }
    }
}
