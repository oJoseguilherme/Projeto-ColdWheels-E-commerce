import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PedidoService, Pedido, StatusPedido } from '../../services/pedido.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-pedidos',
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {
  pedidos: Pedido[] = [];
  termoBusca: string = '';
  statusFiltro: string = 'TODOS';
  carregando: boolean = false;

  readonly listaStatus: StatusPedido[] = ['PENDENTE', 'PAGO', 'ENVIADO', 'ENTREGUE', 'CANCELADO'];

  constructor(
    private pedidoService: PedidoService,
    private snackBar: MatSnackBar,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.cdr.markForCheck();
    this.pedidoService.getPedidos(this.termoBusca, this.statusFiltro).subscribe({
      next: (dados) => {
        this.pedidos = dados;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.pedidos = [];
        this.carregando = false;
        this.cdr.markForCheck();
        this.snackBar.open('Falha ao carregar lista de pedidos da API.', 'Tentar Novamente', {
          duration: 5000
        }).onAction().subscribe(() => this.carregarPedidos());
      }
    });
  }

  onFiltroChange(): void {
    this.carregarPedidos();
  }

  mudarStatus(pedido: Pedido, novoStatus: StatusPedido): void {
    this.pedidoService.atualizarStatus(pedido.id, novoStatus).subscribe({
      next: (atualizado) => {
        pedido.status = atualizado.status;
        this.snackBar.open(`Status do pedido ${pedido.numeroPedido} atualizado para ${novoStatus}.`, 'Ok', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Erro ao atualizar status do pedido.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
