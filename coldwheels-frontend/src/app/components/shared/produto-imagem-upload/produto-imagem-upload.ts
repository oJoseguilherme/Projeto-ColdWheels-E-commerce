import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {
  ArquivoService,
  SlotImagemProduto,
  TipoProdutoArquivo
} from '../../../services/arquivo.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

export interface ProdutoImagemAlteradaEvent {
  slot: SlotImagemProduto;
  imagemUrl: string | null;
}

export interface ProdutoArquivoPendenteEvent {
  slot: SlotImagemProduto;
  file: File | null;
}

@Component({
  selector: 'app-produto-imagem-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './produto-imagem-upload.html',
  styleUrl: './produto-imagem-upload.css'
})
export class ProdutoImagemUploadComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly arquivoService = inject(ArquivoService);
  private readonly snack = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) tipoProduto!: TipoProdutoArquivo;
  @Input() produtoId: number | null = null;
  @Input() labelPrincipal = 'Foto Principal';
  @Input() labelSecundaria = 'Foto Secundária';
  @Input() imagemPrincipalUrl: string | null = null;
  @Input() imagemSecundariaUrl: string | null = null;

  @Output() imagemAlterada = new EventEmitter<ProdutoImagemAlteradaEvent>();
  @Output() arquivoPendente = new EventEmitter<ProdutoArquivoPendenteEvent>();

  previewPrincipal: string | null = null;
  previewSecundaria: string | null = null;
  carregandoPrincipal = false;
  carregandoSecundaria = false;

  obterUrlExibicao(slot: SlotImagemProduto): string | null {
    if (slot === 'principal') {
      return this.previewPrincipal || this.arquivoService.resolverUrlExibicao(this.imagemPrincipalUrl);
    }
    return this.previewSecundaria || this.arquivoService.resolverUrlExibicao(this.imagemSecundariaUrl);
  }

  obterUrlSalva(slot: SlotImagemProduto): string | null {
    return slot === 'principal' ? this.imagemPrincipalUrl : this.imagemSecundariaUrl;
  }

  obterUrlDownload(slot: SlotImagemProduto): string | null {
    const urlSalva = this.obterUrlSalva(slot);
    return this.arquivoService.obterUrlDownload(urlSalva);
  }

  isCarregando(slot: SlotImagemProduto): boolean {
    return slot === 'principal' ? this.carregandoPrincipal : this.carregandoSecundaria;
  }

  onArquivoSelecionado(event: Event, slot: SlotImagemProduto): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file) {
      return;
    }

    const erro = this.arquivoService.validarArquivo(file);
    if (erro) {
      this.snack.open(erro, 'Fechar', { duration: 4500 });
      return;
    }

    this.atualizarPreview(slot, URL.createObjectURL(file));

    // Se o produto ainda não foi criado, armazena como pendente para enviar após o POST
    if (!this.produtoId) {
      this.arquivoPendente.emit({ slot, file });
      this.snack.open('Imagem pronta! Será enviada ao salvar o produto.', 'OK', { duration: 3000 });
      return;
    }

    // Produto já existe: envia direto para o S3 via Quarkus
    this.setCarregando(slot, true);
    this.arquivoService.uploadImagemProduto<any>(this.tipoProduto, this.produtoId, slot, file).subscribe({
      next: (res) => {
        this.setCarregando(slot, false);
        const novaUrl = slot === 'principal' ? res?.imagemUrl : res?.imagemSecundariaUrl;
        if (slot === 'principal') {
          this.imagemPrincipalUrl = novaUrl || null;
        } else {
          this.imagemSecundariaUrl = novaUrl || null;
        }
        this.atualizarPreview(slot, null);
        this.imagemAlterada.emit({ slot, imagemUrl: novaUrl || null });
        this.snack.open('Imagem enviada e armazenada no S3 com sucesso!', 'OK', { duration: 3000 });
      },
      error: (err) => {
        this.setCarregando(slot, false);
        this.atualizarPreview(slot, null);
        const msg = err?.error?.message || 'Erro ao enviar imagem para o servidor.';
        this.snack.open(msg, 'Fechar', { duration: 4500 });
      }
    });
  }

  removerImagem(slot: SlotImagemProduto): void {
    // Se for apenas preview pendente antes de salvar o produto
    if (!this.produtoId) {
      this.atualizarPreview(slot, null);
      this.arquivoPendente.emit({ slot, file: null });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Excluir imagem',
        message: 'Tem certeza que deseja remover esta imagem do armazenamento S3?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (!confirmado || !this.produtoId) {
        return;
      }

      this.setCarregando(slot, true);
      this.arquivoService.excluirImagemProduto<any>(this.tipoProduto, this.produtoId, slot).subscribe({
        next: () => {
          this.setCarregando(slot, false);
          if (slot === 'principal') {
            this.imagemPrincipalUrl = null;
          } else {
            this.imagemSecundariaUrl = null;
          }
          this.atualizarPreview(slot, null);
          this.imagemAlterada.emit({ slot, imagemUrl: null });
          this.snack.open('Imagem removida do S3.', 'OK', { duration: 3000 });
        },
        error: (err) => {
          this.setCarregando(slot, false);
          const msg = err?.error?.message || 'Erro ao excluir imagem.';
          this.snack.open(msg, 'Fechar', { duration: 4000 });
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.previewPrincipal) URL.revokeObjectURL(this.previewPrincipal);
    if (this.previewSecundaria) URL.revokeObjectURL(this.previewSecundaria);
  }

  private atualizarPreview(slot: SlotImagemProduto, url: string | null): void {
    const anterior = slot === 'principal' ? this.previewPrincipal : this.previewSecundaria;
    if (anterior) URL.revokeObjectURL(anterior);
    if (slot === 'principal') {
      this.previewPrincipal = url;
    } else {
      this.previewSecundaria = url;
    }
    this.cdr.markForCheck();
  }

  private setCarregando(slot: SlotImagemProduto, valor: boolean): void {
    this.cdr.markForCheck();
    if (slot === 'principal') {
      this.carregandoPrincipal = valor;
    } else {
      this.carregandoSecundaria = valor;
    }
  }
}
