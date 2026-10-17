export type StatusFornecedor = 'ATIVO' | 'EM_ANALISE' | 'INATIVO';

export interface Fornecedor {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  contatoNome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  marcasFornecidas: string[];
  categoriaPrincipal?: string;
  status: StatusFornecedor;
  prazoEntregaDias: number;
  dataCadastro: string;
  totalProdutosFornecidos?: number;
}

export interface FornecedorRequest {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  contatoNome: string;
  email: string;
  telefone: string;
  cidade: string;
  uf: string;
  marcasFornecidas: string[];
  categoriaPrincipal?: string;
  status: StatusFornecedor;
  prazoEntregaDias: number;
}

export interface ResumoFornecedores {
  totalFornecedores: number;
  totalAtivos: number;
  totalPolos: number;
  prazoMedioDias: number;
}
