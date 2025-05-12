import { Page } from "puppeteer";
import { Logger } from "../utils/logger";
import { Navigator } from "../utils/navigator";
import { ScreenshotManager } from "../utils/screenshot";
import { FileManager } from "../utils/fileManager";

export abstract class BaseAction {
  protected readonly logger: Logger;
  protected readonly navigator: Navigator;
  protected readonly screenshotManager: ScreenshotManager;
  protected page: Page | null = null;
  protected readonly baseUrl = "https://corridadopantanal.com.br"; // URL base do website

  constructor(fileManager: FileManager, logger: Logger) {
    this.logger = logger;
    this.navigator = new Navigator(this.logger);
    this.screenshotManager = new ScreenshotManager(fileManager, this.logger);
  }

  protected async init(): Promise<void> {
    await this.navigator.init();
    this.page = await this.navigator.newPage();
  }

  protected async close(): Promise<void> {
    if (this.page) {
      await this.navigator.close();
      this.page = null;
    }
  }

  protected async takeScreenshot(name: string): Promise<string> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    return this.screenshotManager.screenshot(this.page, name);
  }

  protected async goto(url: string): Promise<void> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    await this.navigator.goto(this.page, url);
  }

  abstract execute(...args: any[]): Promise<void>;
}
