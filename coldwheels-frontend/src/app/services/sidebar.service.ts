import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  // Estado reativo: aberta ou fechada
  readonly aberta = signal<boolean>(false);

  toggle(): void {
    this.aberta.update(v => !v);
  }

  abrir(): void {
    this.aberta.set(true);
  }

  fechar(): void {
    this.aberta.set(false);
  }
}
