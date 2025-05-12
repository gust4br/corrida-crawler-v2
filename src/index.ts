import { ScreenshotManager } from "./utils/screenshot";
import { FileManager } from "./utils/fileManager";
import { Logger } from "./utils/logger";
import { Navigator } from "./utils/navigator";

async function main() {
  const fileManager = new FileManager();
  const logger = new Logger(fileManager.getExecutionDir());
  const navigator = new Navigator(logger);
  const screenshotManager = new ScreenshotManager(fileManager, logger);

  try {
    await navigator.init();
    const page = await navigator.newPage();
    await navigator.goto(page, "https://www.google.com");

    logger.log("Capturando screenshot...");
    await screenshotManager.screenshot(page, "google-home");

    await navigator.close();
    logger.log(`Pasta de execução: ${fileManager.getExecutionDir()}`);
  } catch (error) {
    logger.log(
      `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    );
  }
}

main();
