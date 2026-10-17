import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ClienteResumo } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { SidebarService } from '../../../services/sidebar.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
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
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {

  readonly clientes = signal<ClienteResumo[]>([]);
  readonly filtro = signal('');
  readonly ufSelecionada = signal<string | null>(null);
  readonly ordenacao = signal<string>('nome_asc');

  get filtroComposto(): string {
    if (this.ufSelecionada()) {
      return `uf_${this.ufSelecionada()}`;
    }
    if (this.ordenacao() !== 'nome_asc') {
      return `ord_${this.ordenacao()}`;
    }
    return 'todos';
  }

  set filtroComposto(valor: string) {
    if (!valor || valor === 'todos') {
      this.ufSelecionada.set(null);
      this.ordenacao.set('nome_asc');
    } else if (valor.startsWith('uf_')) {
      this.ufSelecionada.set(valor.replace('uf_', ''));
    } else if (valor.startsWith('ord_')) {
      this.ordenacao.set(valor.replace('ord_', ''));
    }
  }

  // Lista única de UFs disponíveis
  readonly estados = computed(() => {
    const siglas = this.clientes()
      .map(c => c.uf)
      .filter((uf): uf is string => !!uf && uf.trim().length > 0);
    return Array.from(new Set(siglas)).sort((a, b) => a.localeCompare(b));
  });

  readonly temFiltroAtivo = computed(() => {
    return !!(
      this.filtro().trim() ||
      this.ufSelecionada() ||
      this.ordenacao() !== 'nome_asc'
    );
  });

  readonly clientesFiltrados = computed(() => {
    let lista = [...this.clientes()];
    const valor = this.filtro().trim().toLocaleLowerCase('pt-BR');

    // 1. Filtro por Texto (Nome, E-mail, CPF, Telefone ou Município)
    if (valor) {
      lista = lista.filter(cliente =>
        cliente.nome.toLocaleLowerCase('pt-BR').includes(valor) ||
        cliente.email.toLocaleLowerCase('pt-BR').includes(valor) ||
        (cliente.cpf && cliente.cpf.includes(valor)) ||
        (cliente.telefone && cliente.telefone.includes(valor)) ||
        cliente.municipio.toLocaleLowerCase('pt-BR').includes(valor) ||
        cliente.uf.toLocaleLowerCase('pt-BR').includes(valor)
      );
    }

    // 2. Filtro por Estado (UF)
    const uf = this.ufSelecionada();
    if (uf) {
      lista = lista.filter(cliente => cliente.uf === uf);
    }

    // 3. Ordenação
    const ord = this.ordenacao();
    if (ord === 'nome_asc') {
      lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    } else if (ord === 'nome_desc') {
      lista.sort((a, b) => b.nome.localeCompare(a.nome, 'pt-BR'));
    } else if (ord === 'data_desc') {
      lista.sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
    } else if (ord === 'data_asc') {
      lista.sort((a, b) => new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime());
    }

    return lista;
  });

  constructor(
    private readonly clienteService: ClienteService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    public readonly sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.findAll().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(
          this.obterMensagemErro(
            error,
            'Não foi possível carregar os clientes.'
          ),
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
    this.ufSelecionada.set(null);
    this.ordenacao.set('nome_asc');
  }

  excluir(cliente: ClienteResumo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'cw-dialog-panel',
      data: {
        titulo: 'Excluir Cliente',
        mensagem: 'Tem certeza que gostaria de apagar?',
        nomeItem: cliente.nome,
        textoConfirmar: 'Sim',
        textoCancelar: 'Não'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.clienteService.delete(cliente.id).subscribe({
          next: () => {
            this.snackBar.open(
              'Cliente excluído com sucesso.',
              'Ok',
              { duration: 2500 }
            );

            this.carregarClientes();
          },
          error: (error: HttpErrorResponse) => {
            this.snackBar.open(
              this.obterMensagemErro(
                error,
                'Não foi possível excluir o cliente.'
              ),
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
}
