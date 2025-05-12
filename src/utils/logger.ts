import fs from "fs";
import path from "path";

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

  log(message: string): void {
    const logMessage = this.formatMessage(message);

    // Mostra no console e salva no arquivo
    console.log(logMessage);
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }

  internal(message: string): void {
    const logMessage = this.formatMessage(`[INTERNAL] ${message}`);

    // Salva apenas no arquivo
    fs.appendFileSync(this.logFile, logMessage + "\n");
  }
}
