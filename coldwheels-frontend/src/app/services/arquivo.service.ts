import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type TipoProdutoArquivo = 'carrinhos' | 'pistas';
export type SlotImagemProduto = 'principal' | 'secundaria';

@Injectable({
  providedIn: 'root'
})
export class ArquivoService {
  private readonly baseUrl = 'http://localhost:8080';

  readonly maxSizeBytes = 5 * 1024 * 1024; // 5 MB
  readonly tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private readonly http: HttpClient) {}

  validarArquivo(file: File): string | null {
    if (!file || file.size === 0) {
      return 'O arquivo selecionado está vazio.';
    }
    if (file.size > this.maxSizeBytes) {
      return 'O arquivo excede o tamanho máximo permitido de 5 MB.';
    }
    const tipo = (file.type || '').toLowerCase();
    if (!this.tiposPermitidos.includes(tipo)) {
      return 'Formato não permitido. Selecione uma imagem JPEG, PNG ou WEBP.';
    }
    return null;
  }

  uploadImagemProduto<T>(
    tipo: TipoProdutoArquivo,
    produtoId: number,
    slot: SlotImagemProduto,
    file: File
  ): Observable<T> {
    const formData = new FormData();
    formData.append('arquivo', file, file.name);
    return this.http.post<T>(`${this.baseUrl}/${tipo}/${produtoId}/imagens/${slot}`, formData);
  }

  excluirImagemProduto<T>(
    tipo: TipoProdutoArquivo,
    produtoId: number,
    slot: SlotImagemProduto
  ): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${tipo}/${produtoId}/imagens/${slot}`);
  }

  resolverUrlExibicao(url?: string | null): string | null {
    if (!url) {
      return null;
    }
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('assets/images/')) {
      return `${this.baseUrl}/arquivos/assets/${url.slice('assets/images/'.length)}`;
    }
    if (url.startsWith('/arquivos/')) {
      return `${this.baseUrl}${url}`;
    }
    return url;
  }

  obterUrlDownload(url?: string | null): string | null {
    const resolvida = this.resolverUrlExibicao(url);
    if (!resolvida) {
      return null;
    }
    if (resolvida.startsWith(this.baseUrl + '/arquivos/assets/')) {
      return resolvida + '?download=true';
    }
    if (resolvida.includes('/arquivos/') && !resolvida.endsWith('/download')) {
      return `${resolvida}/download`;
    }
    return resolvida;
  }
}
