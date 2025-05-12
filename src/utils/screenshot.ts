import { Page } from "puppeteer";
import { FileManager } from "./fileManager";
import { Logger } from "./logger";
import path from "path";

export class ScreenshotManager {
  private readonly fileManager: FileManager;
  private readonly logger: Logger;

  constructor(fileManager: FileManager, logger: Logger) {
    this.fileManager = fileManager;
    this.logger = logger;
  }

  async screenshot(page: Page, name: string): Promise<string> {
    const filename = `${name}-${Date.now()}.png`;
    const filepath = path.join(this.fileManager.getExecutionDir(), filename);

    this.logger.internal(`Iniciando captura de screenshot: ${filename}`);

    await page.screenshot({
      path: filepath,
      fullPage: true,
    });

    this.logger.internal(`Screenshot capturado com sucesso: ${filepath}`);
    return filepath;
  }
}
