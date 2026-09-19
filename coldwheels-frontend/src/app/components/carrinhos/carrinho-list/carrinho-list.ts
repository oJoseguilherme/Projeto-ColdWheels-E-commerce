import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { Carrinho } from '../../../models/carrinho.model';
import { Categoria } from '../../../models/categoria.model';
import { CarrinhoService } from '../../../services/carrinho.service';
import { CategoriaService } from '../../../services/categoria.service';

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
    MatCardModule,
    MatFormFieldModule
  ],
  styleUrl: './carrinho-list.css',
  templateUrl: './carrinho-list.html',
})
export class CarrinhoList implements OnInit {
  carrinhos: Carrinho[] = [];
  categorias: Categoria[] = [];

  // Filtros
  termoBusca: string = '';
  idCategoriaSelecionada: number | null = null;

  // Paginação Angular Material (PageResponse do professor)
  pageIndex: number = 0;
  pageSize: number = 8;
  pageSizeOptions: number[] = [4, 8, 12, 24];
  totalItems: number = 0;

  constructor(
    private carrinhoService: CarrinhoService,
    private categoriaService: CategoriaService,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
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

  limparFiltros(): void {
    this.termoBusca = '';
    this.idCategoriaSelecionada = null;
    this.pageIndex = 0;
    this.atualizarUrl();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.atualizarUrl();
  }

  excluir(carrinho: Carrinho): void {
    if (confirm(`Deseja realmente excluir o carrinho "${carrinho.nome}"?`)) {
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
  }
}
