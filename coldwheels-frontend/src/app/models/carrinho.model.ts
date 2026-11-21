import { Categoria } from './categoria.model';
import { Marca } from './marca.model';
import { Fornecedor } from './fornecedor.model';

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
    marca?: Marca;
    idMarca?: number | null;
    fornecedor?: Fornecedor;
    idFornecedor?: number | null;
    dataCadastro?: string;
    imagemUrl?: string | null;
    imagemSecundariaUrl?: string | null;
}