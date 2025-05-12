import { BaseAction } from "./base";
import { LoginSelectors, HomeSelectors } from "../types/selectors";

export class LoginAction extends BaseAction {
  async execute(email: string, senha: string): Promise<void> {
    try {
      await this.init();
      await this.goto(`${this.baseUrl}/usuarios/login`);

      if (!this.page) {
        throw new Error("Page not initialized");
      }

      await this.page.waitForSelector(LoginSelectors.emailInput);

      await this.page.type(LoginSelectors.emailInput, email);
      await this.page.type(LoginSelectors.passwordInput, senha);

      await this.takeScreenshot("login-form-filled");

      await this.page.click(LoginSelectors.submitButton);

      await this.page.waitForNavigation();

      const emailInput = await this.page.$(HomeSelectors.emailInput);
      if (emailInput) {
        const emailValue = await this.page.evaluate(
          (el) => el.getAttribute("value"),
          emailInput
        );
        if (emailValue !== email) {
          throw new Error("Email de login incorreto");
        }
      }

      await this.takeScreenshot("login-success");

      this.logger.log("Login realizado com sucesso!");
    } catch (error) {
      this.logger.log(
        `Erro durante o login: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
      throw error;
    } finally {
      await this.close();
    }
  }
}
