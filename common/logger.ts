type LogLevel = "log" | "warn" | "error";

export class Logger {
    protected static logColor = "#5865F2";
    protected static logsHistory: string[] = [];

    protected readonly type: string = 'plugin';

    constructor(protected readonly context: string) {
    }

    static getHistory(): string[] {
        return Logger.logsHistory;
    }

    info(...message: any[]): void {
        this.log("log", message);
    }

    warn(...message: any[]): void {
        this.log("warn", message);
    }

    error(...message: any[]): void {
        this.log("error", message);
    }

    protected log(level: LogLevel, message: any[]): void {
        const formattedMessage = `[distrust:${this.type}:${this.context}] ${message.join(' ')}`;
        Logger.logsHistory.push(formattedMessage);
        console[level](`%c[${this.context}]`, `color: ${Logger.logColor}`, ...message);
    }

    protected logRaw(level: LogLevel, message: any[]): void {
        const formattedMessage = `[distrust:${this.type}:${this.context}] ${message}`;
        Logger.logsHistory.push(formattedMessage);
        console[level](`%c[${this.context}]`, `color: ${Logger.logColor}`, message);
    }
}

export class CoreLogger extends Logger {
    protected readonly type: string = 'core'
    protected readonly logColor: string = '#6873c8';
}
