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

  get filtroComposto(): string {
    if (this.idCategoriaSelecionada !== null) {
      return `cat_${this.idCategoriaSelecionada}`;
    }
    if (this.filtroEstoque !== 'todos') {
      return `est_${this.filtroEstoque}`;
    }
    if (this.ordenacao !== 'nome_asc') {
      return `ord_${this.ordenacao}`;
    }
    return 'todos';
  }

  set filtroComposto(valor: string) {
    if (!valor || valor === 'todos') {
      this.idCategoriaSelecionada = null;
      this.filtroEstoque = 'todos';
      this.ordenacao = 'nome_asc';
    } else if (valor.startsWith('cat_')) {
      this.idCategoriaSelecionada = Number(valor.replace('cat_', ''));
      this.filtroEstoque = 'todos';
    } else if (valor.startsWith('est_')) {
      this.filtroEstoque = valor.replace('est_', '');
      this.idCategoriaSelecionada = null;
    } else if (valor.startsWith('ord_')) {
      this.ordenacao = valor.replace('ord_', '');
    }
    this.onFiltroChange();
  }

  // Paginação Angular Material (PageResponse do professor)
  pageIndex: number = 0;
  pageSize: number = 8;
  pageSizeOptions: number[] = [4, 8, 12, 24];
  totalItems: number = 0;

  constructor(
    private carrinhoService: CarrinhoService,
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public readonly sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();

    // Sincroniza com Query Params da URL (Ex: ?page=1&idCategoria=1)
    this.route.queryParamMap.subscribe(params => {
      const p = Number(params.get('page'));
      this.pageIndex = p && p > 0 ? p - 1 : 0;

      const ps = Number(params.get('pageSize'));
      this.pageSize = ps && ps > 0 ? ps : 8;

      this.termoBusca = params.get('nome') || '';

      const idCat = params.get('idCategoria');
      this.idCategoriaSelecionada = idCat ? Number(idCat) : null;

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
    const idCat = this.idCategoriaSelecionada ? this.idCategoriaSelecionada : undefined;
    this.carrinhoService.findAll(this.pageIndex, this.pageSize, this.termoBusca, idCat).subscribe({
      next: (pagina) => {
        this.carrinhos = pagina.items || [];
        this.totalItems = pagina.totalItems || 0;
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

  atualizarUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        nome: this.termoBusca ? this.termoBusca : null,
        idCategoria: this.idCategoriaSelecionada ? this.idCategoriaSelecionada : null
      },
      queryParamsHandling: 'merge'
    });
  }

  onFiltroChange(): void {
    this.pageIndex = 0;
    this.atualizarUrl();
  }

  get carrinhosProcessados(): Carrinho[] {
    let lista = [...this.carrinhos];

    if (this.filtroEstoque === 'baixo') {
      lista = lista.filter(c => c.estoque <= 5);
    } else if (this.filtroEstoque === 'disponivel') {
      lista = lista.filter(c => c.estoque > 0);
    }

    if (this.ordenacao === 'nome_asc') {
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (this.ordenacao === 'nome_desc') {
      lista.sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (this.ordenacao === 'preco_asc') {
      lista.sort((a, b) => a.preco - b.preco);
    } else if (this.ordenacao === 'preco_desc') {
      lista.sort((a, b) => b.preco - a.preco);
    } else if (this.ordenacao === 'ano_desc') {
      lista.sort((a, b) => b.anoLancamento - a.anoLancamento);
    } else if (this.ordenacao === 'ano_asc') {
      lista.sort((a, b) => a.anoLancamento - b.anoLancamento);
    }

    return lista;
  }

  get temFiltroAtivo(): boolean {
    return !!(this.termoBusca || this.idCategoriaSelecionada || this.ordenacao !== 'nome_asc' || this.filtroEstoque !== 'todos');
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.idCategoriaSelecionada = null;
    this.ordenacao = 'nome_asc';
    this.filtroEstoque = 'todos';
    this.pageIndex = 0;
    this.atualizarUrl();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.atualizarUrl();
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
        badgeTopoDireito: item.escala || '1:64',
        preco: item.preco,
        descricao: item.descricao,
        estoque: item.estoque,
        atributos: [
          { label: 'Escala', valor: item.escala || '1:64', icone: 'aspect_ratio' },
          { label: 'Ano de Lançamento', valor: item.anoLancamento, icone: 'calendar_today' },
          { label: 'Cor Predominante', valor: item.cor || 'Não informada', icone: 'palette' },
          { label: 'Categoria', valor: item.categoria?.nome || 'Padrão', icone: 'category' }
        ]
      }
    });
  }

  getImagem(item: any): string | null {
    return item?.imagemUrl || item?.imagem || item?.foto || null;
  }
}
