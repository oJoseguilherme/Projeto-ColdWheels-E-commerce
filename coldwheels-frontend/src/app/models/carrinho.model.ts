import { Categoria } from './categoria.model';

export class Carrinho {
    id!: number;
    nome!: string;
    descricao!: string;
    escala!: string;
    anoLancamento!: number;
    cor!: string;
    preco!: number;
    estoque!: number;
    categoria?: Categoria;
    idCategoria?: number;
    dataCadastro?: string;
}