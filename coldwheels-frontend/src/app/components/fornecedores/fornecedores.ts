import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Fornecedor, FornecedorRequest, ResumoFornecedores } from '../../models/fornecedor.model';
import { FornecedorService } from '../../services/fornecedor.service';
import { SidebarService } from '../../services/sidebar.service';
import { VelocimetroComponent } from '../velocimetro/velocimetro';
import { FornecedorDialogComponent } from './fornecedor-dialog/fornecedor-dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog';
import { ItemDetailDialogComponent } from '../shared/item-detail-dialog/item-detail-dialog';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    VelocimetroComponent
  ],
  templateUrl: './fornecedores.html',
  styleUrl: './fornecedores.css'
})
export class FornecedoresComponent implements OnInit {
  resumo: ResumoFornecedores = {
    totalFornecedores: 0,
    totalAtivos: 0,
    totalPolos: 0,
    prazoMedioDias: 0
  };

  fornecedores: Fornecedor[] = [];

  // Filtros
  termoBusca: string = '';
  ufSelecionada: string | null = null;
  marcaSelecionada: string | null = null;
  statusSelecionado: string | null = null;
  ordenacao: string = 'nome_asc';

  get filtroComposto(): string {
    if (this.ufSelecionada) {
      return `uf_${this.ufSelecionada}`;
    }
    if (this.marcaSelecionada) {
      return `mrc_${this.marcaSelecionada}`;
    }
    if (this.statusSelecionado) {
      return `st_${this.statusSelecionado}`;
    }
    if (this.ordenacao !== 'nome_asc') {
      return `ord_${this.ordenacao}`;
    }
    return 'todos';
  }

  set filtroComposto(valor: string) {
    if (!valor || valor === 'todos') {
      this.ufSelecionada = null;
      this.marcaSelecionada = null;
      this.statusSelecionado = null;
      this.ordenacao = 'nome_asc';
    } else if (valor.startsWith('uf_')) {
      this.ufSelecionada = valor.replace('uf_', '');
      this.marcaSelecionada = null;
      this.statusSelecionado = null;
    } else if (valor.startsWith('mrc_')) {
      this.marcaSelecionada = valor.replace('mrc_', '');
      this.ufSelecionada = null;
      this.statusSelecionado = null;
    } else if (valor.startsWith('st_')) {
      this.statusSelecionado = valor.replace('st_', '');
      this.ufSelecionada = null;
      this.marcaSelecionada = null;
    } else if (valor.startsWith('ord_')) {
      this.ordenacao = valor.replace('ord_', '');
    }
  }

  get polosDisponiveis(): string[] {
    const ufs = this.fornecedores.map(f => f.uf).filter((u): u is string => !!u);
    return Array.from(new Set(ufs)).sort((a, b) => a.localeCompare(b));
  }

  get marcasDisponiveis(): string[] {
    const marcas: string[] = [];
    for (const f of this.fornecedores) {
      if (f.marcasFornecidas && Array.isArray(f.marcasFornecidas)) {
        marcas.push(...f.marcasFornecidas);
      }
    }
    return Array.from(new Set(marcas)).sort((a, b) => a.localeCompare(b));
  }

  get temFiltroAtivo(): boolean {
    return !!(
      this.termoBusca.trim() ||
      this.ufSelecionada ||
      this.marcaSelecionada ||
      this.statusSelecionado ||
      this.ordenacao !== 'nome_asc'
    );
  }

  get fornecedoresProcessados(): Fornecedor[] {
    let lista = [...this.fornecedores];
    const termo = this.termoBusca.trim().toLowerCase();

    // 1. Filtro por Texto (busca em nome, razão social, CNPJ, contato, email, polo e marcas)
    if (termo) {
      lista = lista.filter(f =>
        f.nomeFantasia.toLowerCase().includes(termo) ||
        f.razaoSocial.toLowerCase().includes(termo) ||
        f.cnpj.includes(termo) ||
        f.contatoNome.toLowerCase().includes(termo) ||
        f.email.toLowerCase().includes(termo) ||
        f.cidade.toLowerCase().includes(termo) ||
        f.uf.toLowerCase().includes(termo) ||
        (f.marcasFornecidas && f.marcasFornecidas.some(m => m.toLowerCase().includes(termo)))
      );
    }

    // 2. Filtro por UF
    if (this.ufSelecionada) {
      lista = lista.filter(f => f.uf === this.ufSelecionada);
    }

    // 3. Filtro por Marca Fornecida
    if (this.marcaSelecionada) {
      lista = lista.filter(f => f.marcasFornecidas && f.marcasFornecidas.includes(this.marcaSelecionada!));
    }

    // 4. Filtro por Status
    if (this.statusSelecionado) {
      lista = lista.filter(f => f.status === this.statusSelecionado);
    }

    // 5. Ordenação
    if (this.ordenacao === 'nome_asc') {
      lista.sort((a, b) => a.nomeFantasia.localeCompare(b.nomeFantasia, 'pt-BR'));
    } else if (this.ordenacao === 'nome_desc') {
      lista.sort((a, b) => b.nomeFantasia.localeCompare(a.nomeFantasia, 'pt-BR'));
    } else if (this.ordenacao === 'prazo_asc') {
      lista.sort((a, b) => a.prazoEntregaDias - b.prazoEntregaDias);
    } else if (this.ordenacao === 'data_desc') {
      lista.sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
    }

    return lista;
  }

  constructor(
    private fornecedorService: FornecedorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.fornecedorService.getResumo().subscribe({
      next: (r) => {
        this.resumo = r;
        this.cdr.markForCheck();
      },
      error: () => {
        console.warn('Não foi possível obter resumo de fornecedores da API.');
        this.cdr.markForCheck();
      }
    });

    this.fornecedorService.getFornecedores().subscribe({
      next: (f) => {
        this.fornecedores = f;
        this.cdr.markForCheck();
      },
      error: () => {
        this.fornecedores = [];
        this.cdr.markForCheck();
        this.snackBar.open('Falha ao carregar lista de fornecedores da API.', 'Tentar Novamente', {
          duration: 5000
        }).onAction().subscribe(() => this.carregarDados());
      }
    });
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.ufSelecionada = null;
    this.marcaSelecionada = null;
    this.statusSelecionado = null;
    this.ordenacao = 'nome_asc';
  }

  abrirModalNovoFornecedor(): void {
    const dialogRef = this.dialog.open(FornecedorDialogComponent, {
      panelClass: 'cw-dialog-panel',
      width: '620px'
    });

    dialogRef.afterClosed().subscribe((dados: FornecedorRequest | null) => {
      if (dados) {
        this.fornecedorService.criarFornecedor(dados).subscribe({
          next: (criado) => {
            this.snackBar.open(`Fornecedor "${criado.nomeFantasia}" cadastrado com sucesso!`, 'Ok', {
              duration: 2500
            });
            this.carregarDados();
          },
          error: () => {
            this.snackBar.open('Erro ao cadastrar fornecedor.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  editarFornecedor(fornecedor: Fornecedor): void {
    const dialogRef = this.dialog.open(FornecedorDialogComponent, {
      panelClass: 'cw-dialog-panel',
      width: '620px',
      data: { fornecedor }
    });

    dialogRef.afterClosed().subscribe((dados: FornecedorRequest | null) => {
      if (dados) {
        this.fornecedorService.atualizarFornecedor(fornecedor.id, dados).subscribe({
          next: (atualizado) => {
            this.snackBar.open(`Fornecedor "${atualizado.nomeFantasia}" atualizado com sucesso!`, 'Ok', {
              duration: 2500
            });
            this.carregarDados();
          },
          error: () => {
            this.snackBar.open('Erro ao atualizar fornecedor.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  excluirFornecedor(fornecedor: Fornecedor): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'cw-dialog-panel',
      data: {
        titulo: 'Excluir Fornecedor',
        mensagem: 'Tem certeza que gostaria de apagar?',
        nomeItem: fornecedor.nomeFantasia,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.fornecedorService.excluirFornecedor(fornecedor.id).subscribe({
          next: () => {
            this.snackBar.open(`Fornecedor "${fornecedor.nomeFantasia}" excluído com sucesso.`, 'Ok', {
              duration: 2500
            });
            this.carregarDados();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir fornecedor.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  abrirDetalhes(fornecedor: Fornecedor): void {
    const marcasStr = (fornecedor.marcasFornecidas && fornecedor.marcasFornecidas.length > 0)
      ? fornecedor.marcasFornecidas.join(', ')
      : 'Não especificada';

    this.dialog.open(ItemDetailDialogComponent, {
      panelClass: 'cw-card-flip-dialog',
      maxWidth: '680px',
      width: '92vw',
      data: {
        tipo: 'marca',
        titulo: fornecedor.nomeFantasia,
        subtitulo: fornecedor.razaoSocial,
        badgeTopoDireito: `${fornecedor.cidade} • ${fornecedor.uf}`,
        descricao: `Polo logístico e comercial homologado para fornecimento de: ${marcasStr}. Prazo médio de reposição estimado em ${fornecedor.prazoEntregaDias} dias úteis.`,
        atributos: [
          { label: 'CNPJ', valor: fornecedor.cnpj, icone: 'badge' },
          { label: 'Razão Social', valor: fornecedor.razaoSocial, icone: 'business' },
          { label: 'Marcas Fornecidas', valor: marcasStr, icone: 'sell' },
          { label: 'Representante', valor: fornecedor.contatoNome, icone: 'person' },
          { label: 'Contato', valor: fornecedor.email, icone: 'email' },
          { label: 'Telefone', valor: fornecedor.telefone, icone: 'phone' },
          { label: 'Polo Logístico', valor: `${fornecedor.cidade} - ${fornecedor.uf}`, icone: 'place' },
          { label: 'Prazo Médio', valor: `${fornecedor.prazoEntregaDias} dias úteis`, icone: 'schedule' },
          { label: 'Status da Parceria', valor: fornecedor.status === 'ATIVO' ? 'Homologado' : 'Em Análise', icone: 'verified' }
        ]
      }
    });
  }
}
