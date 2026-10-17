import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Subcomponentes
import { CarrinhoList } from '../carrinhos/carrinho-list/carrinho-list';
import { PistaList } from '../pistas/pista-list/pista-list';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-produtos',
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CarrinhoList,
    PistaList
  ],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {
  activeTab: 'carrinhos' | 'pistas' = 'carrinhos';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const tab = params.get('tab');
      if (tab === 'pistas' || tab === 'carrinhos') {
        this.activeTab = tab;
      }
    });
  }

  setTab(tab: 'carrinhos' | 'pistas'): void {
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }
}
