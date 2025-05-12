import { FileManager } from "../utils/fileManager";
import { Logger } from "../utils/logger";
import { Navigator } from "../utils/navigator";

export abstract class BaseAction {
  protected navigator: Navigator;
  protected readonly baseUrl = "https://corridadopantanal.com.br";

  constructor(
    protected readonly fileManager: FileManager,
    protected readonly logger: Logger
  ) {
    this.navigator = new Navigator(logger, fileManager);
  }

  protected async init(): Promise<void> {
    if (!this.navigator) {
      this.navigator = new Navigator(this.logger, this.fileManager);
    }
    await this.navigator.init();
  }

  protected async goto(url: string): Promise<void> {
    await this.navigator.goto(url);
  }

  protected async type(selector: string, text: string): Promise<void> {
    await this.navigator.type(selector, text);
  }

  protected async click(selector: string): Promise<void> {
    await this.navigator.click(selector);
  }

  protected async select(selector: string, value: string): Promise<void> {
    await this.navigator.select(selector, value);
  }

  protected async waitForSelector(selector: string): Promise<void> {
    await this.navigator.waitForSelector(selector);
  }

  protected async waitForFunction(
    fn: () => boolean,
    options?: { timeout?: number }
  ): Promise<void> {
    await this.navigator.waitForFunction(fn, options);
  }

  protected async getElementText(selector: string): Promise<string | null> {
    return this.navigator.getElementText(selector);
  }

  protected async getElementValue(selector: string): Promise<string | null> {
    return this.navigator.getElementValue(selector);
  }

  protected async getCurrentUrl(): Promise<string> {
    return this.navigator.getCurrentUrl();
  }

  protected async takeScreenshot(name: string): Promise<void> {
    await this.navigator.takeScreenshot(name);
  }

  protected async close(): Promise<void> {
    await this.navigator.close();
  }

  protected async waitForNavigation(options?: {
    timeout?: number;
  }): Promise<void> {
    await this.navigator.waitForNavigation(options);
  }

  abstract execute(...args: any[]): Promise<void>;
}
