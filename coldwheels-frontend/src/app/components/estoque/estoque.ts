import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { EstoqueService, ItemEstoque, ResumoEstoque } from '../../services/estoque.service';
import { SidebarService } from '../../services/sidebar.service';
import { VelocimetroComponent } from '../velocimetro/velocimetro';

@Component({
  selector: 'app-estoque',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CurrencyPipe,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    VelocimetroComponent
  ],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css'
})
export class Estoque implements OnInit {
  resumo: ResumoEstoque = { emEstoque: 0, estoqueBaixo: 0, esgotado: 0 };
  itens: ItemEstoque[] = [];
  
  termoBusca: string = '';
  filtroComposto: string = 'TODOS';
  carregando: boolean = false;

  constructor(
    private estoqueService: EstoqueService,
    private snackBar: MatSnackBar,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarItens();
  }

  carregarResumo(): void {
    this.estoqueService.getResumo().subscribe({
      next: (r) => {
        this.resumo = r;
        this.cdr.markForCheck();
      },
      error: () => {
        this.snackBar.open('Falha ao carregar indicadores de estoque da API.', 'Fechar', { duration: 4000 });
        this.cdr.markForCheck();
      }
    });
  }

  carregarItens(): void {
    this.carregando = true;
    this.cdr.markForCheck();
    this.estoqueService.getItens(this.termoBusca, this.filtroComposto).subscribe({
      next: (itens) => {
        this.itens = itens;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.itens = [];
        this.carregando = false;
        this.cdr.markForCheck();
        this.snackBar.open('Falha na comunicação com a API ao carregar o estoque.', 'Tentar Novamente', {
          duration: 5000
        }).onAction().subscribe(() => this.carregarItens());
      }
    });
  }

  onFiltroChange(): void {
    this.carregarItens();
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.filtroComposto = 'TODOS';
    this.onFiltroChange();
  }

  get temFiltroAtivo(): boolean {
    return !!(this.termoBusca.trim() || this.filtroComposto !== 'TODOS');
  }

  ajustarEstoque(item: ItemEstoque, delta: number): void {
    this.estoqueService.ajustarQuantidade(item.id, delta, item.tipo).subscribe({
      next: (atualizado) => {
        item.quantidade = atualizado.quantidade;
        item.status = atualizado.status;
        this.carregarResumo();
        this.snackBar.open(`Estoque de "${item.nome}" atualizado para ${item.quantidade} un.`, 'Ok', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar estoque.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
