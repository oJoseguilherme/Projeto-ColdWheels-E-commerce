
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';


import { Carrinho } from '../../../models/carrinho.model';
import { CarrinhoService } from '../../../services/carrinho.service';
@Component({
  imports: [
    CommonModule,
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
  selector: 'app-carrinho-list',
  styleUrl: './carrinho-list.css',
  templateUrl: './carrinho-list.html',
})
export class CarrinhoList implements OnInit {
  carrinhos: Carrinho[] = [];
  carrinhosFiltrados: Carrinho[] = [];
  constructor(
    private carrinhoService: CarrinhoService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.carregarCarrinhos();
  }

  carregarCarrinhos(): void {
    this.carrinhoService.findAll().subscribe({
      next: (dados) => {
        this.carrinhos = dados;
        this.carrinhosFiltrados = dados;
        this.cdr.detectChanges(); // <-- Força a tela a desenhar os cards na hora!
      },
      error: (err) => {
        console.error('Erro ao buscar carrinhos:', err);
        this.snack.open('Erro ao conectar com o backend!', 'Fechar', {
          duration: 3000
        });
      }
    });
  }


  applyFilter(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.carrinhosFiltrados = this.carrinhos.filter(c =>
      c.nome.toLowerCase().includes(valor) ||
      c.cor.toLowerCase().includes(valor) ||
      c.escala.toLowerCase().includes(valor)
    );

  }

  excluir(carrinho: Carrinho): void {
    if (confirm(`Deseja realmente excluir o carrinho"${carrinho.nome}"?`)) {
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


