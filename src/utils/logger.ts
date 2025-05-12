import fs from "fs";
import path from "path";

// Códigos ANSI para cores
const COLORS = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
} as const;

export class Logger {
  private readonly logFile: string;

  constructor(executionDir: string) {
    this.logFile = path.join(executionDir, "execution.log");
  }

  private formatMessage(message: string): string {
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return `[${timestamp}] ${message}`;
  }

  private getColoredTimestamp(): string {
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `[${COLORS.cyan}${timestamp}${COLORS.reset}]`;
  }

  log(message: string): void {
    const logMessage = this.formatMessage(message);
    const coloredMessage = `${this.getColoredTimestamp()} ${message}`;

    console.log(coloredMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  error(message: string): void {
    const logMessage = this.formatMessage(message);
    const coloredMessage = `${this.getColoredTimestamp()} ${
      COLORS.red
    }${message}${COLORS.reset}`;

    console.error(coloredMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  success(message: string): void {
    const logMessage = this.formatMessage(message);
    const coloredMessage = `${this.getColoredTimestamp()} ${
      COLORS.green
    }${message}${COLORS.reset}`;

    console.log(coloredMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  warning(message: string): void {
    const logMessage = this.formatMessage(message);
    const coloredMessage = `${this.getColoredTimestamp()} ${
      COLORS.yellow
    }${message}${COLORS.reset}`;

    console.log(coloredMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  internal(message: string): void {
    const logMessage = this.formatMessage(`[INTERNAL] ${message}`);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }
}
