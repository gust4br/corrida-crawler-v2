import { createInterface } from "readline";
import { Usuario, CamisetaTamanho, Categoria } from "../types/user";
import fs from "fs";
import path from "path";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const questionWithOptions = async (
  query: string,
  options: string[]
): Promise<string> => {
  console.log("\nOpções disponíveis:");
  options.forEach((opt, index) => console.log(`${index + 1} - ${opt}`));

  while (true) {
    const answer = await question(`\n${query} (1-${options.length}): `);
    const index = parseInt(answer) - 1;
    if (index >= 0 && index < options.length) {
      return options[index];
    }
    console.log("❌ Opção inválida!");
  }
};

async function registerUser(): Promise<void> {
  console.log("\n=== Cadastro de Usuário ===\n");

  // Dados básicos
  const nomeCompleto = await question("Nome completo: ");
  const cpf = await question("CPF (apenas números): ");
  const email = await question("Email: ");
  const telefone = await question("Telefone (com DDD): ");
  const senha = await question("Senha: ");

  // Dados da corrida
  console.log("\n=== Dados para a Corrida ===\n");

  const dataNascimento = await question("Data de nascimento (YYYY-MM-DD): ");
  const genero = await question("Gênero: ");
  const nomeMae = await question("Nome da mãe: ");

  // Endereço
  console.log("\n=== Endereço ===\n");
  const logradouro = await question("Logradouro: ");
  const numero = await question("Número: ");
  const complemento = (await question("Complemento (opcional): ")) || undefined;
  const bairro = await question("Bairro: ");
  const cidade = await question("Cidade: ");
  const estado = await question("Estado (UF): ");
  const cep = await question("CEP: ");

  // Categoria e camiseta
  const categoria = (await questionWithOptions(
    "Categoria da corrida",
    Object.values(Categoria)
  )) as Categoria;

  const tamanhoCamiseta = (await questionWithOptions(
    "Tamanho da camiseta",
    Object.values(CamisetaTamanho)
  )) as CamisetaTamanho;

  // Plano de saúde
  console.log("\n=== Plano de Saúde ===\n");
  const temPlano =
    (await question("Possui plano de saúde? (s/n): ")).toLowerCase() === "s";
  const nomePlano = temPlano ? await question("Nome do plano: ") : undefined;

  // Contato de emergência (opcional)
  console.log("\n=== Contato de Emergência (opcional) ===\n");
  const temContatoEmergencia =
    (
      await question("Deseja cadastrar um contato de emergência? (s/n): ")
    ).toLowerCase() === "s";

  let contatoEmergencia;
  if (temContatoEmergencia) {
    contatoEmergencia = {
      nomeCompleto: await question("Nome completo: "),
      email: await question("Email: "),
      telefone: await question("Telefone: "),
    };
  }

  // Redes sociais (opcional)
  console.log("\n=== Redes Sociais (opcional) ===\n");
  const temRedesSociais =
    (
      await question("Deseja cadastrar redes sociais? (s/n): ")
    ).toLowerCase() === "s";

  let redesSociais;
  if (temRedesSociais) {
    redesSociais = {
      instagram: await question("Instagram: "),
      facebook: await question("Facebook: "),
      tiktok: await question("TikTok: "),
      linkedin: await question("LinkedIn: "),
      twitter: await question("Twitter: "),
    };
  }

  const usuario: Usuario = {
    nomeCompleto,
    cpf,
    email,
    telefone,
    senha,
    cadastroCorrida: {
      nomeCompleto,
      email,
      dataNascimento,
      telefone,
      cpf,
      genero,
      nomeMae,
      endereco: {
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
      },
      categoria,
      tamanhoCamiseta,
      planoSaude: {
        temPlano,
        nomePlano,
      },
      contatoEmergencia,
      redesSociais,
    },
  };

  // Lê o arquivo atual de usuários
  const dataPath = path.join(process.cwd(), "src", "data", "usuarios.json");
  let usuarios: { usuarios: Usuario[] };

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    usuarios = JSON.parse(data);
  } catch (error) {
    usuarios = { usuarios: [] };
  }

  // Verifica se o usuário já existe
  const usuarioExiste = usuarios.usuarios.some(
    (u) => u.cpf === cpf || u.email === email
  );

  if (usuarioExiste) {
    console.log("\n❌ Usuário já cadastrado com este CPF ou email!");
    rl.close();
    return;
  }

  // Adiciona o novo usuário
  usuarios.usuarios.push(usuario);

  // Salva no arquivo
  fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));

  console.log("\n✅ Usuário cadastrado com sucesso!");
  rl.close();
}

registerUser().catch((error) => {
  console.error("Erro ao cadastrar usuário:", error);
  rl.close();
});
