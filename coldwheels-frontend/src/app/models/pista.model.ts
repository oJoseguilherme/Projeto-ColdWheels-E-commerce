export interface PistaRequest {
  nome: string;
  descricao: string;
  preco: number;
  anoLancamento?: number | null;
  quantidadePecas?: number | null;
  idadeMinima: number;
  colecao: string;
  estoque: number;
  imagemUrl?: string | null;
  imagemSecundariaUrl?: string | null;
}

export interface Pista extends PistaRequest {
  id: number;
  dataCadastro: string;
}