import { BaseAction } from "./base";
import { RegisterSelectors } from "../types/selectors";
import { Usuario } from "../types/user";

export class RegisterAction extends BaseAction {
  async execute(usuario: Usuario): Promise<void> {
    try {
      await this.init();
      await this.goto(`${this.baseUrl}/usuarios/cadastro`);

      // Aguarda o formulário estar disponível
      await this.waitForSelector(RegisterSelectors.nameInput);

      // Preenche os campos básicos do formulário
      await this.type(RegisterSelectors.nameInput, usuario.nomeCompleto);
      await this.type(RegisterSelectors.cpfInput, usuario.cpf);
      await this.type(RegisterSelectors.emailInput, usuario.email);
      await this.type(RegisterSelectors.phoneInput, usuario.telefone);
      await this.type(RegisterSelectors.passwordInput, usuario.senha);
      await this.type(
        RegisterSelectors.passwordConfirmationInput,
        usuario.senha
      );

      await this.takeScreenshot("register-form-filled");

      // Submete o formulário
      await this.click(RegisterSelectors.submitButton);

      await this.waitForFunction(
        () => {
          const form = document.querySelector("form");
          const errorBlock = document.querySelector(".error-block");
          return Boolean(!form || errorBlock);
        },
        { timeout: 10000 }
      );

      const url = await this.getCurrentUrl();
      if (url.includes("/usuarios")) {
        const errorBlock = await this.getElementText(".error-block");
        if (errorBlock) {
          const errorMessages = errorBlock.split("\n").filter(Boolean);
          if (errorMessages.length > 0) {
            const errorText = errorMessages.join(", ");
            this.logger.error(`Erros no cadastro: ${errorText}`);
            throw new Error(`Falha no cadastro: ${errorText}`);
          }
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
