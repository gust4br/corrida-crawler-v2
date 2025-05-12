import { BaseAction } from "./base";
import { LoginSelectors, HomeSelectors } from "../types/selectors";

export class LoginAction extends BaseAction {
  async execute(email: string, senha: string): Promise<void> {
    try {
      await this.init();
      await this.goto(`${this.baseUrl}/usuarios/login`);

      await this.waitForSelector(LoginSelectors.emailInput);

      await this.type(LoginSelectors.emailInput, email);
      await this.type(LoginSelectors.passwordInput, senha);

      await this.takeScreenshot("login-form-filled");

      await this.click(LoginSelectors.submitButton);

      await this.waitForNavigation();

      const emailValue = await this.getElementValue(HomeSelectors.emailInput);
      if (emailValue && emailValue !== email) {
        throw new Error("Email de login incorreto");
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
