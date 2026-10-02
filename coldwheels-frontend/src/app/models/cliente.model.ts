export interface Estado {
  codigoIbge: string;
  nome: string;
  sigla: string;
}

export interface Municipio {
  codigoIbge: string;
  nome: string;
  estado: Estado;
}

export interface EnderecoRequest {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  codigoIbgeMunicipio: string;
}

export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: Municipio;
}

export interface ClienteRequest {
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string | null;
  telefone: string | null;
  endereco: EnderecoRequest;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string | null;
  telefone: string | null;
  endereco: Endereco;
  dataCadastro: string;
}

export interface ClienteResumo {
  id: number;
  nome: string;
  email: string;
  municipio: string;
  uf: string;
  dataCadastro: string;
}
