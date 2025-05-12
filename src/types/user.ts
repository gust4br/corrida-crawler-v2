export enum CamisetaTamanho {
  P = "P",
  M = "M",
  G = "G",
  GG = "GG",
  XG = "XG",
  EG = "EG",
  EG2 = "EG2",
}

export enum Categoria {
  "4K" = "4K",
  "8K" = "8K",
}
// Será preenchido em breve

export interface RedesSociais {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ContatoEmergencia {
  nomeCompleto: string;
  email: string;
  telefone: string;
}

export interface PlanoSaude {
  temPlano: boolean;
  nomePlano?: string;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface RegistroUsuario {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface CadastroCorrida {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  telefone: string;
  cpf: string;
  genero: string;
  nomeMae: string;
  endereco: Endereco;
  categoria: Categoria;
  tamanhoCamiseta: CamisetaTamanho;
  planoSaude: PlanoSaude;
  contatoEmergencia?: ContatoEmergencia;
  redesSociais?: RedesSociais;
}

export interface Usuario extends RegistroUsuario {
  cadastroCorrida?: CadastroCorrida;
}
