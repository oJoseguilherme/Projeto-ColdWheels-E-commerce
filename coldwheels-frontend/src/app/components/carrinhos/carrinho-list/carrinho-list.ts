import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { Carrinho } from '../../../models/carrinho.model';
import { Categoria } from '../../../models/categoria.model';
import { CarrinhoService } from '../../../services/carrinho.service';
import { CategoriaService } from '../../../services/categoria.service';
import { CarrinhoFotoService } from '../../../services/carrinho-foto.service';
import { SidebarService } from '../../../services/sidebar.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { ItemDetailDialogComponent } from '../../shared/item-detail-dialog/item-detail-dialog';

@Component({
  selector: 'app-carrinho-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CurrencyPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule
  ],
  styleUrl: './carrinho-list.css',
  templateUrl: './carrinho-list.html',
})
export class CarrinhoList implements OnInit {
  @Input() isEmbedded: boolean = false;
  carrinhos: Carrinho[] = [];
  categorias: Categoria[] = [];

  // Filtros
  termoBusca: string = '';
  idCategoriaSelecionada: number | null = null;
  ordenacao: string = 'nome_asc';
  filtroEstoque: string = 'todos';
  filtroCompostoValor: string = 'todos';

  get filtroComposto(): string {
    return this.filtroCompostoValor;
  }

  set filtroComposto(valor: string) {
    this.filtroCompostoValor = valor || 'todos';
    if (!valor || valor === 'todos') {
      this.idCategoriaSelecionada = null;
      this.filtroEstoque = 'todos';
      this.ordenacao = 'nome_asc';
    } else if (valor.startsWith('cat_')) {
      this.idCategoriaSelecionada = Number(valor.replace('cat_', ''));
      this.filtroEstoque = 'todos';
      this.ordenacao = 'nome_asc';
    } else if (valor.startsWith('est_')) {
      this.filtroEstoque = valor.replace('est_', '');
      this.idCategoriaSelecionada = null;
      this.ordenacao = 'nome_asc';
    } else if (valor.startsWith('ord_')) {
      this.ordenacao = valor.replace('ord_', '');
      this.idCategoriaSelecionada = null;
      this.filtroEstoque = 'todos';
    }
    this.onFiltroChange();
  }

  // Paginação Angular Material
  pageIndex: number = 0;
  pageSize: number = 24;
  pageSizeOptions: number[] = [12, 24, 48, 100];
  totalItems: number = 0;

  constructor(
    private carrinhoService: CarrinhoService,
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public readonly sidebarService: SidebarService,
    private carrinhoFotoService: CarrinhoFotoService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();

    // Sincroniza com Query Params da URL (Ex: ?nome=mustang&idCategoria=1)
    this.route.queryParamMap.subscribe(params => {
      this.termoBusca = params.get('nome') || '';

      const idCat = params.get('idCategoria');
      if (idCat) {
        this.idCategoriaSelecionada = Number(idCat);
        this.filtroCompostoValor = `cat_${this.idCategoriaSelecionada}`;
      }

      this.carregarCarrinhos();
    });
  }

  carregarCategorias(): void {
    this.categoriaService.findAll().subscribe({
      next: (dados) => {
        this.categorias = dados;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
      }
    });
  }

  carregarCarrinhos(): void {
    this.carrinhoService.findAllSemPaginacao().subscribe({
      next: (dados) => {
        this.carrinhos = dados || [];
        this.totalItems = this.carrinhos.length;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar carrinhos:', err);
        this.snack.open('Erro ao conectar com o backend!', 'Fechar', {
          duration: 3000
        });
      }
    });
  }

  onFiltroChange(): void {
    this.pageIndex = 0;
    this.cdr.detectChanges();
  }

  get carrinhosProcessados(): Carrinho[] {
    let lista = [...this.carrinhos];

    if (this.termoBusca && this.termoBusca.trim()) {
      const termo = this.termoBusca.trim().toLowerCase();
      lista = lista.filter(c =>
        (c.nome && c.nome.toLowerCase().includes(termo)) ||
        (c.descricao && c.descricao.toLowerCase().includes(termo)) ||
        (c.cor && c.cor.toLowerCase().includes(termo)) ||
        (c.anoLancamento && c.anoLancamento.toString().includes(termo)) ||
        (c.categoria?.nome && c.categoria.nome.toLowerCase().includes(termo)) ||
        (c.marca?.nome && c.marca.nome.toLowerCase().includes(termo))
      );
    }

    if (this.idCategoriaSelecionada !== null) {
      lista = lista.filter(c => c.categoria?.id === this.idCategoriaSelecionada);
    }

    if (this.filtroEstoque === 'baixo') {
      lista = lista.filter(c => (c.estoque ?? 0) <= 5);
    } else if (this.filtroEstoque === 'disponivel') {
      lista = lista.filter(c => (c.estoque ?? 0) > 0);
    }

    if (this.ordenacao === 'nome_asc') {
      lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
    } else if (this.ordenacao === 'nome_desc') {
      lista.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR', { sensitivity: 'base' }));
    } else if (this.ordenacao === 'preco_asc') {
      lista.sort((a, b) => (a.preco ?? 0) - (b.preco ?? 0));
    } else if (this.ordenacao === 'preco_desc') {
      lista.sort((a, b) => (b.preco ?? 0) - (a.preco ?? 0));
    } else if (this.ordenacao === 'ano_desc') {
      lista.sort((a, b) => (b.anoLancamento ?? 0) - (a.anoLancamento ?? 0));
    } else if (this.ordenacao === 'ano_asc') {
      lista.sort((a, b) => (a.anoLancamento ?? 0) - (b.anoLancamento ?? 0));
    }

    return lista;
  }

  get carrinhosPaginados(): Carrinho[] {
    const processados = this.carrinhosProcessados;
    this.totalItems = processados.length;
    const inicio = this.pageIndex * this.pageSize;
    return processados.slice(inicio, inicio + this.pageSize);
  }

  get temFiltroAtivo(): boolean {
    return !!(this.termoBusca.trim() || this.filtroCompostoValor !== 'todos');
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.idCategoriaSelecionada = null;
    this.ordenacao = 'nome_asc';
    this.filtroEstoque = 'todos';
    this.filtroCompostoValor = 'todos';
    this.pageIndex = 0;
    this.cdr.detectChanges();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.detectChanges();
  }

  excluir(carrinho: Carrinho): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'cw-dialog-panel',
      data: {
        titulo: 'Excluir Carrinho',
        mensagem: 'Tem certeza que gostaria de apagar?',
        nomeItem: carrinho.nome,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.carrinhoService.delete(carrinho.id).subscribe({
          next: () => {
            this.snack.open('Carrinho excluído com sucesso', 'Ok', {
              duration: 2500
            });
            this.carregarCarrinhos();
          },
          error: (err) => {
            console.error('Erro ao excluir', err);
            this.snack.open('Erro ao excluir o carrinho.', 'Fechar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  abrirDetalhes(item: Carrinho): void {
    this.dialog.open(ItemDetailDialogComponent, {
      panelClass: 'cw-card-flip-dialog',
      maxWidth: '680px',
      width: '92vw',
      data: {
        tipo: 'carrinho',
        titulo: item.nome,
        subtitulo: item.categoria?.nome || 'Coleção Oficial',
        imagemUrl: this.getImagem(item),
        imagemSecundariaUrl: this.getImagemSecundaria(item),
        badgeTopoDireito: item.escala || '1:64',
        preco: item.preco,
        descricao: item.descricao,
        estoque: item.estoque,
        atributos: [
          { label: 'Escala', valor: item.escala || '1:64', icone: 'aspect_ratio' },
          { label: 'Ano de Lançamento', valor: item.anoLancamento, icone: 'calendar_today' },
          { label: 'Cor Predominante', valor: item.cor || 'Não informada', icone: 'palette' },
          { label: 'Categoria', valor: item.categoria?.nome || 'Padrão', icone: 'category' },
          ...(item.marca ? [{ label: 'Marca Licenciada', valor: item.marca.nome, icone: 'verified' }] : []),
          ...(item.fornecedor ? [{ label: 'Fornecedor', valor: item.fornecedor.nomeFantasia || item.fornecedor.razaoSocial, icone: 'business' }] : [])
        ]
      }
    });
  }

  getImagem(item: any): string | null {
    return this.carrinhoFotoService.getFotoPrincipal(item);
  }

  getImagemSecundaria(item: any): string | null {
    return this.carrinhoFotoService.getFotoSecundaria(item);
  }
}
