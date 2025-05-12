import { FileManager } from "./utils/fileManager";
import { Logger } from "./utils/logger";
import { LoginAction, RegisterAction } from "./actions";
import { getAllUsers } from "./utils/userData";

async function processUser(usuario: any) {
  const fileManager = new FileManager();
  const logger = new Logger(fileManager.getExecutionDir());

  try {
    logger.log("🚀 Iniciando execução...");
    logger.internal(`Usuário: ${usuario.email}`);

    const loginAction = new LoginAction(fileManager, logger);
    try {
      await loginAction.execute(usuario.email, usuario.senha);
      logger.log("✅ Login realizado com sucesso!");
      return;
    } catch (error) {
      logger.log("❌ Login falhou, iniciando processo de registro...");
      logger.internal(
        `Erro no login: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }

    const registerAction = new RegisterAction(fileManager, logger);
    await registerAction.execute(usuario);
    logger.log("✅ Registro realizado com sucesso!");
  } catch (error) {
    logger.log("❌ Erro na execução");
    logger.internal(
      `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
    );
  } finally {
    logger.log("🏁 Finalizando execução");
  }
}

async function main() {
  const usuarios = await getAllUsers();
  if (usuarios.length === 0) {
    console.log("Nenhum usuário encontrado em usuarios.json");
    process.exit(1);
  }

  console.log(`📋 Processando ${usuarios.length} usuário(s)...`);
  for (const usuario of usuarios) {
    await processUser(usuario);
  }
  process.exit(0);
}

main();
