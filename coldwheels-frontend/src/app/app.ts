import { Component, signal, inject, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SidebarService } from './services/sidebar.service';

@Component({
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('coldwheels-frontend');

  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);

  private lastScrollY = 0;
  private scrollListener?: () => void;
  private routerSub?: Subscription;

  constructor(public sidebarService: SidebarService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Estado inicial: no topo da página
      this.document.body.classList.add('header-at-top');

      // Listener de scroll de alta performance fora do NgZone
      this.ngZone.runOutsideAngular(() => {
        const onScroll = () => this.handleScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        this.scrollListener = () => window.removeEventListener('scroll', onScroll);
      });

      // Resetar estado da barra e scroll ao navegar entre rotas
      this.routerSub = this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          window.scrollTo(0, 0);
          this.lastScrollY = 0;
          const body = this.document.body;
          body.classList.add('header-at-top');
          body.classList.remove('header-hidden');
          body.classList.remove('header-scrolled');
        });
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private handleScroll(): void {
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const deltaY = currentScrollY - this.lastScrollY;
    const body = this.document.body;

    // 1. No topo da página (<= 15px): funde a barra com a cor do fundo do centro
    if (currentScrollY <= 15) {
      body.classList.add('header-at-top');
      body.classList.remove('header-hidden');
      body.classList.remove('header-scrolled');
    } else {
      body.classList.remove('header-at-top');

      // 2. Ao rolar para baixo e já tiver passado do topo, oculta a barra
      if (deltaY > 6 && currentScrollY > 70) {
        body.classList.add('header-hidden');
        body.classList.remove('header-scrolled');
      }
      // 3. Ao arrastar para cima / rolar para cima, exibe a barra
      else if (deltaY < -6) {
        body.classList.remove('header-hidden');
        body.classList.add('header-scrolled');
      }
    }

    this.lastScrollY = currentScrollY;
  }
}
