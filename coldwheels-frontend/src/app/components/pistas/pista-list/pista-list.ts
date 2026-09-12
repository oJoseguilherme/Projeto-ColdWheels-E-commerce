import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Pista } from '../../../models/pista.model';
import { PistaService } from '../../../services/pista.service';

@Component({
  selector: 'app-pista-list',
  imports: [
    RouterLink,
    CurrencyPipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './pista-list.html',
  styleUrl: './pista-list.css'
})
export class PistaList implements OnInit {

  readonly pistas = signal<Pista[]>([]);
  readonly filtro = signal('');

  readonly pistasFiltradas = computed(() => {
    const valor = this.filtro().trim().toLocaleLowerCase('pt-BR');

    if (!valor) {
      return this.pistas();
    }

    return this.pistas().filter(pista =>
      pista.nome.toLocaleLowerCase('pt-BR').includes(valor) ||
      pista.colecao.toLocaleLowerCase('pt-BR').includes(valor) ||
      pista.descricao.toLocaleLowerCase('pt-BR').includes(valor) ||
      pista.anoLancamento.toString().includes(valor)
    );
  });

  constructor(
    private readonly pistaService: PistaService,
    private readonly snackBar: MatSnackBar
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

  excluir(pista: Pista): void {
    const confirmado = confirm(
      `Deseja realmente excluir a pista "${pista.nome}"?`
    );

    if (!confirmado) {
      return;
    }

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