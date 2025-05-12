import { Page, Browser } from "puppeteer";
import { Logger } from "./logger";
import puppeteer from "puppeteer";

export class Navigator {
  private browser: Browser | null = null;

  constructor(private readonly logger: Logger) {}

  async init(): Promise<void> {
    this.logger.log("Iniciando o navegador...");
    this.browser = await puppeteer.launch({
      headless: true,
    });
  }

  async newPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error("Browser não inicializado. Chame init() primeiro.");
    }

    this.logger.log("Abrindo browser...");
    const page = await this.browser.newPage();
    await this.setupPage(page);
    return page;
  }

  async setupPage(page: Page): Promise<void> {
    await page.setViewport({
      width: 1366,
      height: 1536, // 768 * 2
      deviceScaleFactor: 1,
    });
    this.logger.internal("Viewport configurado: 1366x1536");
  }

  async goto(page: Page, url: string): Promise<void> {
    this.logger.log(`Navegando para: ${url}`);
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 1000 * 15, //15s
    });

    const title = await page.title();
    this.logger.log(`Página carregada: ${title}`);
  }

  async close(): Promise<void> {
    if (this.browser) {
      this.logger.log("Fechando o navegador...");
      await this.browser.close();
      this.browser = null;
      this.logger.log("Navegador fechado com sucesso!");
    }
  }
}
