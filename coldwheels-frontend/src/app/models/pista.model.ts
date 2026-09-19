export interface PistaRequest {
  nome: string;
  descricao: string;
  preco: number;
  anoLancamento: number;
  quantidadePecas: number;
  idadeMinima: number;
  colecao: string;
  estoque: number;
}

export interface Pista extends PistaRequest {
  id: number;
  dataCadastro: string;
}