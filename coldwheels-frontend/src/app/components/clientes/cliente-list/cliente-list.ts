import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ClienteResumo } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  imports: [
    RouterLink,
    DatePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {

  readonly clientes = signal<ClienteResumo[]>([]);
  readonly filtro = signal('');

  readonly clientesFiltrados = computed(() => {
    const valor = this.filtro().trim().toLocaleLowerCase('pt-BR');

    if (!valor) {
      return this.clientes();
    }

    return this.clientes().filter(cliente =>
      cliente.nome.toLocaleLowerCase('pt-BR').includes(valor) ||
      cliente.email.toLocaleLowerCase('pt-BR').includes(valor) ||
      cliente.municipio.toLocaleLowerCase('pt-BR').includes(valor) ||
      cliente.uf.toLocaleLowerCase('pt-BR').includes(valor)
    );
  });

  constructor(
    private readonly clienteService: ClienteService,
    private readonly snackBar: MatSnackBar
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

  excluir(cliente: ClienteResumo): void {
    const confirmado = confirm(
      `Deseja realmente excluir o cliente "${cliente.nome}"?`
    );

    if (!confirmado) {
      return;
    }

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
