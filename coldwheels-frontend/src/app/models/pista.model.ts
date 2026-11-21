import { Marca } from './marca.model';
import { Fornecedor } from './fornecedor.model';

export interface PistaRequest {
  nome: string;
  descricao: string;
  preco: number;
  anoLancamento?: number | null;
  quantidadePecas?: number | null;
  idadeMinima: number;
  colecao: string;
  estoque: number;
  idMarca?: number | null;
  idFornecedor?: number | null;
  imagemUrl?: string | null;
  imagemSecundariaUrl?: string | null;
}

export interface Pista extends PistaRequest {
  id: number;
  marca?: Marca;
  fornecedor?: Fornecedor;
  dataCadastro: string;
}