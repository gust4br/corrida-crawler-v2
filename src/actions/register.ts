import { BaseAction } from "./base";
import { RegisterSelectors } from "../types/selectors";
import { Usuario } from "../types/user";

export class RegisterAction extends BaseAction {
  async execute(usuario: Usuario): Promise<void> {
    try {
      await this.init();
      await this.goto(`${this.baseUrl}/usuarios/cadastro`);

      if (!this.page) {
        throw new Error("Page not initialized");
      }

      // Aguarda o formulário estar disponível
      await this.page.waitForSelector(RegisterSelectors.nameInput);

      // Preenche os campos básicos do formulário
      await this.page.type(RegisterSelectors.nameInput, usuario.nomeCompleto);
      await this.page.type(RegisterSelectors.cpfInput, usuario.cpf);
      await this.page.type(RegisterSelectors.emailInput, usuario.email);
      await this.page.type(RegisterSelectors.phoneInput, usuario.telefone);
      await this.page.type(RegisterSelectors.passwordInput, usuario.senha);
      await this.page.type(
        RegisterSelectors.passwordConfirmationInput,
        usuario.senha
      );

      await this.takeScreenshot("register-form-filled");

      // Submete o formulário
      await this.page.click(RegisterSelectors.submitButton);

      await this.page.waitForFunction(
        () => {
          const form = document.querySelector("form");
          const errorBlock = document.querySelector(".error-block");
          return !form || errorBlock;
        },
        { timeout: 10000 } // 10 segundos de timeout
      );

      const url = await this.page.url();
      if (url.includes("/usuarios")) {
        const errorBlock = await this.page.$(".error-block");
        if (errorBlock) {
          const errorMessages = await this.page.evaluate((block) => {
            const items = block.querySelectorAll("li");
            return Array.from(items).map((item) => item.textContent?.trim());
          }, errorBlock);

          if (errorMessages.length > 0) {
            const errorText = errorMessages.join(", ");
            throw new Error(`Falha no cadastro: ${errorText}`);
          }

          await this.takeScreenshot("error");
        }
        throw new Error(
          "Não houve redirecionamento após o envio do formulário"
        );
      }

      await this.takeScreenshot("register-success");

      this.logger.success("Registro realizado com sucesso!");
    } catch (error) {
      this.logger.error(
        `Erro durante o registro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
      await this.takeScreenshot("error");
      throw error;
    } finally {
      await this.close();
    }
  }
}
