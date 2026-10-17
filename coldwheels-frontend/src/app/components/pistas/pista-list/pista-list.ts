import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Pista } from '../../../models/pista.model';
import { PistaService } from '../../../services/pista.service';
import { PistaFotoService } from '../../../services/pista-foto.service';
import { SidebarService } from '../../../services/sidebar.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { ItemDetailDialogComponent } from '../../shared/item-detail-dialog/item-detail-dialog';

@Component({
  selector: 'app-pista-list',
  imports: [
    RouterLink,
    CurrencyPipe,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './pista-list.html',
  styleUrl: './pista-list.css'
})
export class PistaList implements OnInit {
  @Input() isEmbedded: boolean = false;

  readonly pistas = signal<Pista[]>([]);
  readonly filtro = signal('');
  readonly colecaoSelecionada = signal<string | null>(null);
  readonly filtroEstoque = signal<string>('todos');
  readonly ordenacao = signal<string>('nome_asc');

  get filtroComposto(): string {
    if (this.colecaoSelecionada()) {
      return `col_${this.colecaoSelecionada()}`;
    }
    if (this.filtroEstoque() !== 'todos') {
      return `est_${this.filtroEstoque()}`;
    }
    if (this.ordenacao() !== 'nome_asc') {
      return `ord_${this.ordenacao()}`;
    }
    return 'todos';
  }

  set filtroComposto(valor: string) {
    if (!valor || valor === 'todos') {
      this.colecaoSelecionada.set(null);
      this.filtroEstoque.set('todos');
      this.ordenacao.set('nome_asc');
    } else if (valor.startsWith('col_')) {
      this.colecaoSelecionada.set(valor.replace('col_', ''));
      this.filtroEstoque.set('todos');
    } else if (valor.startsWith('est_')) {
      this.filtroEstoque.set(valor.replace('est_', ''));
      this.colecaoSelecionada.set(null);
    } else if (valor.startsWith('ord_')) {
      this.ordenacao.set(valor.replace('ord_', ''));
    }
  }

  // Extrai lista única de coleções disponíveis a partir dos registros carregados
  readonly colecoes = computed(() => {
    const nomes = this.pistas()
      .map(p => p.colecao)
      .filter((c): c is string => !!c && c.trim().length > 0);
    return Array.from(new Set(nomes)).sort((a, b) => a.localeCompare(b));
  });

  readonly temFiltroAtivo = computed(() => {
    return !!(
      this.filtro().trim() ||
      this.colecaoSelecionada() ||
      this.filtroEstoque() !== 'todos' ||
      this.ordenacao() !== 'nome_asc'
    );
  });

  readonly pistasFiltradas = computed(() => {
    let lista = [...this.pistas()];
    const valor = this.filtro().trim().toLocaleLowerCase('pt-BR');

    // 1. Filtro por Texto (Nome, Descrição ou Ano)
    if (valor) {
      lista = lista.filter(pista =>
        pista.nome.toLocaleLowerCase('pt-BR').includes(valor) ||
        pista.colecao.toLocaleLowerCase('pt-BR').includes(valor) ||
        pista.descricao.toLocaleLowerCase('pt-BR').includes(valor) ||
        (pista.anoLancamento?.toString().includes(valor) ?? false)
      );
    }

    // 2. Filtro por Coleção
    const col = this.colecaoSelecionada();
    if (col) {
      lista = lista.filter(pista => pista.colecao === col);
    }

    // 3. Filtro por Estoque
    const est = this.filtroEstoque();
    if (est === 'baixo') {
      lista = lista.filter(pista => pista.estoque <= 5);
    } else if (est === 'disponivel') {
      lista = lista.filter(pista => pista.estoque > 0);
    }

    // 4. Ordenação
    const ord = this.ordenacao();
    if (ord === 'nome_asc') {
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (ord === 'nome_desc') {
      lista.sort((a, b) => b.nome.localeCompare(a.nome));
    } else if (ord === 'preco_asc') {
      lista.sort((a, b) => a.preco - b.preco);
    } else if (ord === 'preco_desc') {
      lista.sort((a, b) => b.preco - a.preco);
    } else if (ord === 'ano_desc') {
      lista.sort((a, b) => (b.anoLancamento ?? 0) - (a.anoLancamento ?? 0));
    } else if (ord === 'ano_asc') {
      lista.sort((a, b) => (a.anoLancamento ?? 0) - (b.anoLancamento ?? 0));
    } else if (ord === 'pecas_desc') {
      lista.sort((a, b) => (b.quantidadePecas ?? 0) - (a.quantidadePecas ?? 0));
    } else if (ord === 'pecas_asc') {
      lista.sort((a, b) => (a.quantidadePecas ?? 0) - (b.quantidadePecas ?? 0));
    }

    return lista;
  });

  constructor(
    private readonly pistaService: PistaService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    public readonly sidebarService: SidebarService,
    private readonly pistaFotoService: PistaFotoService
  ) {}

  ngOnInit(): void {
    this.carregarPistas();
  }

  carregarPistas(): void {
    this.pistaService.findAll().subscribe({
      next: (pistas) => {
        this.pistas.set(pistas);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao buscar pistas:', error);

        this.snackBar.open(
          this.obterMensagemErro(error, 'Não foi possível carregar as pistas.'),
          'Fechar',
          { duration: 3000 }
        );
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtro.set(input.value);
  }

  limparFiltros(): void {
    this.filtro.set('');
    this.colecaoSelecionada.set(null);
    this.filtroEstoque.set('todos');
    this.ordenacao.set('nome_asc');
  }

  excluir(pista: Pista): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'cw-dialog-panel',
      data: {
        titulo: 'Excluir Pista',
        mensagem: 'Tem certeza que gostaria de apagar?',
        nomeItem: pista.nome,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.pistaService.delete(pista.id).subscribe({
          next: () => {
            this.snackBar.open(
              'Pista excluída com sucesso.',
              'Ok',
              { duration: 2500 }
            );

            this.carregarPistas();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao excluir pista:', error);

            this.snackBar.open(
              this.obterMensagemErro(error, 'Não foi possível excluir a pista.'),
              'Fechar',
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  private obterMensagemErro(
    error: HttpErrorResponse,
    mensagemPadrao: string
  ): string {
    if (error.status === 0) {
      return 'Não foi possível conectar ao servidor.';
    }

    if (
      typeof error.error === 'object' &&
      error.error !== null &&
      typeof error.error.message === 'string'
    ) {
      return error.error.message;
    }

    return mensagemPadrao;
  }

  abrirDetalhes(pista: Pista): void {
    this.dialog.open(ItemDetailDialogComponent, {
      panelClass: 'cw-card-flip-dialog',
      maxWidth: '680px',
      width: '92vw',
      data: {
        tipo: 'pista',
        titulo: pista.nome,
        subtitulo: pista.colecao || 'Pistas & Traçados',
        imagemUrl: this.getImagem(pista),
        imagemSecundariaUrl: this.getImagemSecundaria(pista),
        badgeTopoDireito: `${pista.quantidadePecas} PEÇAS`,
        preco: pista.preco,
        descricao: pista.descricao,
        estoque: pista.estoque,
        atributos: [
          { label: 'Qtd. de Peças', valor: `${pista.quantidadePecas} peças`, icone: 'extension' },
          { label: 'Ano de Lançamento', valor: pista.anoLancamento, icone: 'calendar_today' },
          { label: 'Idade Recomendada', valor: `${pista.idadeMinima}+ anos`, icone: 'child_care' },
          { label: 'Coleção / Linha', valor: pista.colecao || 'Standard', icone: 'style' }
        ]
      }
    });
  }

  getImagem(item: any): string | null {
    return this.pistaFotoService.getFotoPrincipal(item);
  }

  getImagemSecundaria(item: any): string | null {
    return this.pistaFotoService.getFotoSecundaria(item);
  }
}