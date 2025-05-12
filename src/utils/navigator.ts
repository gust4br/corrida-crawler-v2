import { Page, Browser } from "puppeteer";
import { Logger } from "./logger";
import puppeteer from "puppeteer";
import { FileManager } from "./fileManager";

export class Navigator {
  private browser: Browser | null = null;
  private currentPage: Page | null = null;

  constructor(
    private readonly logger: Logger,
    private readonly fileManager: FileManager
  ) {}

  async init(): Promise<void> {
    this.logger.log("Iniciando o navegador...");
    this.browser = await puppeteer.launch({
      headless: true,
    });
    this.currentPage = await this.browser.newPage();
    await this.setupPage(this.currentPage);
  }

  async newPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error("Browser não inicializado. Chame init() primeiro.");
    }

    this.logger.log("Abrindo nova página...");
    this.currentPage = await this.browser.newPage();
    await this.setupPage(this.currentPage);
    return this.currentPage;
  }

  async setupPage(page: Page): Promise<void> {
    await page.setViewport({
      width: 1366,
      height: 1536, // 768 * 2
      deviceScaleFactor: 1,
    });
    this.logger.internal("Viewport configurado: 1366x1536");
  }

  async goto(url: string): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.log(`Navegando para: ${url}`);
    await this.currentPage.goto(url, {
      waitUntil: "networkidle0",
      timeout: 1000 * 15, //15s
    });

    const title = await this.currentPage.title();
    this.logger.log(`Página carregada: ${title}`);
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.internal(`Digitando em ${selector}: ${text}`);
    await this.currentPage.type(selector, text);
  }

  async click(selector: string): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.internal(`Clicando em ${selector}`);
    await this.currentPage.click(selector);
  }

  async select(selector: string, value: string): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.internal(`Selecionando ${value} em ${selector}`);
    await this.currentPage.select(selector, value);
  }

  async waitForSelector(selector: string): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.internal(`Aguardando elemento ${selector}`);
    await this.currentPage.waitForSelector(selector);
  }

  async waitForFunction(
    fn: () => boolean,
    options?: { timeout?: number }
  ): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.internal("Aguardando condição personalizada");
    await this.currentPage.waitForFunction(fn, options);
  }

  async getElementText(selector: string): Promise<string | null> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    return this.currentPage.$eval(selector, (el) => el.textContent);
  }

  async getElementValue(selector: string): Promise<string | null> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    return this.currentPage.$eval(
      selector,
      (el) => (el as HTMLInputElement).value
    );
  }

  async getCurrentUrl(): Promise<string> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    return this.currentPage.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Nenhuma página aberta. Chame newPage() primeiro.");
    }

    this.logger.internal(`Capturando screenshot: ${name}`);
    await this.currentPage.screenshot({
      path: this.fileManager.getScreenshotPath(name),
      fullPage: true,
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      this.logger.log("Fechando o navegador...");
      await this.browser.close();
      this.browser = null;
      this.currentPage = null;
      this.logger.log("Navegador fechado com sucesso!");
    }
  }

  async waitForNavigation(options?: { timeout?: number }): Promise<void> {
    if (!this.currentPage) {
      throw new Error("Page not initialized");
    }

    try {
      await this.currentPage.waitForNavigation(options);
    } catch (error) {
      this.logger.error(
        `Erro ao aguardar navegação: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
      throw error;
    }
  }
}
