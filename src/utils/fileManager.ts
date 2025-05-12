import fs from "fs";
import path from "path";

export class FileManager {
  private readonly baseDir: string;
  private readonly executionDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "executions");
    this.executionDir = this.createExecutionDir();
  }

  private createExecutionDir(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dir = path.join(this.baseDir, `execution-${timestamp}`);

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir);
    }

    fs.mkdirSync(dir);
    return dir;
  }

  getExecutionDir(): string {
    return this.executionDir;
  }

  getScreenshotPath(name: string): string {
    return path.join(this.executionDir, `${name}.png`);
  }
}
