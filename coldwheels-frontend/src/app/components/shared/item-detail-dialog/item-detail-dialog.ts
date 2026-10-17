import { Component, Inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ItemType = 'carrinho' | 'pista' | 'marca';

export interface AtributoItem {
  label: string;
  valor: string | number;
  icone?: string;
}

export interface DetailDialogData {
  tipo: ItemType;
  titulo: string;
  subtitulo?: string;
  imagemUrl?: string | null;
  badgeTopoDireito?: string;
  preco?: number;
  descricao?: string;
  atributos: AtributoItem[];
  estoque?: number;
  iniciarNoVerso?: boolean;
}

@Component({
  selector: 'app-item-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './item-detail-dialog.html',
  styleUrl: './item-detail-dialog.css'
})
export class ItemDetailDialogComponent {
  isFlipped: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ItemDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DetailDialogData
  ) {
    if (data?.iniciarNoVerso) {
      this.isFlipped = true;
    }
  }

  alternarGiro(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isFlipped = !this.isFlipped;
  }

  fechar(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialogRef.close();
  }
}
