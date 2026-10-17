import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';

// Services & Models
import { DashboardService, DashboardMetricas, ItemEstoqueBaixo, PedidoRecente } from '../../services/dashboard.service';
import { SidebarService } from '../../services/sidebar.service';
import { VelocimetroComponent } from '../velocimetro/velocimetro';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    VelocimetroComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  metricas: DashboardMetricas = {
    vendasTotais: 0,
    totalUsuarios: 0,
    totalPedidos: 0,
    estoqueBaixoCount: 0
  };

  produtosEstoqueBaixo: ItemEstoqueBaixo[] = [];
  pedidosRecentes: PedidoRecente[] = [];
  carregando: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    public sidebarService: SidebarService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    this.cdr.markForCheck();

    this.dashboardService.getMetricas().subscribe({
      next: (m) => {
        this.metricas = m;
        this.cdr.markForCheck();
      },
      error: () => {
        console.warn('Não foi possível obter métricas da API.');
        this.cdr.markForCheck();
      }
    });

    this.dashboardService.getProdutosEstoqueBaixo().subscribe({
      next: (itens) => {
        this.produtosEstoqueBaixo = itens;
        this.cdr.markForCheck();
      },
      error: () => {
        this.produtosEstoqueBaixo = [];
        this.cdr.markForCheck();
      }
    });

    this.dashboardService.getPedidosRecentes().subscribe({
      next: (pedidos) => {
        this.pedidosRecentes = pedidos;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.pedidosRecentes = [];
        this.carregando = false;
        this.cdr.markForCheck();
      }
    });
  }
}