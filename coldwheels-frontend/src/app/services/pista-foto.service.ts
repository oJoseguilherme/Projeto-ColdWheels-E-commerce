import { Injectable, inject } from '@angular/core';
import { ArquivoService } from './arquivo.service';

export interface PistaFotoPar {
  principal: string;
  secundaria?: string | null;
  slug: string;
}

interface CatalogoPistaFotoDef {
  slug: string;
  keywords: string[];
  principal: string;
  secundaria?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PistaFotoService {
  private readonly arquivoService = inject(ArquivoService);

  private readonly catalogo: CatalogoPistaFotoDef[] = [
    {
      slug: 'lanca-e-bate',
      keywords: ['acrobacias', 'lanca e bate', 'lanca bate', 'bate'],
      principal: 'http://localhost:8080/arquivos/assets/pistas/lanca-e-bate/principal.webp'
    },
    {
      slug: 'super-lancamento',
      keywords: ['super lancamento', 'super'],
      principal: 'http://localhost:8080/arquivos/assets/pistas/super-lancamento/principal.webp'
    },
    {
      slug: 'campeonato-loop',
      keywords: ['campeonato de loop', 'campeonato', 'loop'],
      principal: 'http://localhost:8080/arquivos/assets/pistas/campeonato-loop/principal.webp'
    },
    {
      slug: 'sprint',
      keywords: ['sprint', 'racing pista'],
      principal: 'http://localhost:8080/arquivos/assets/pistas/sprint/principal.webp'
    },
    {
      slug: 'desafio-equilibrio',
      keywords: ['desafio do equilibrio', 'equilibrio', 'balance shift', 'steam'],
      principal: 'http://localhost:8080/arquivos/assets/pistas/desafio-equilibrio/principal.webp'
    }
  ];

  private readonly idFallbackMap: Record<number, string> = {
    1: 'lanca-e-bate',
    2: 'super-lancamento',
    3: 'campeonato-loop',
    4: 'sprint',
    5: 'desafio-equilibrio',
    9: 'lanca-e-bate',
    10: 'super-lancamento',
    11: 'campeonato-loop',
    12: 'sprint',
    13: 'desafio-equilibrio'
  };

  /**
   * Obtém os dados de foto da pista
   */
  getFotoPar(item: any): PistaFotoPar | null {
    if (!item) return null;

    if (item.imagemUrl || item.imagemSecundariaUrl) {
      return {
        principal: this.arquivoService.resolverUrlExibicao(item.imagemUrl)
          || this.arquivoService.resolverUrlExibicao(item.imagemSecundariaUrl)
          || '',
        secundaria: this.arquivoService.resolverUrlExibicao(item.imagemSecundariaUrl),
        slug: 'custom'
      };
    }

    const nomeNorm = this.normalizarTexto(item.nome || '');
    if (nomeNorm) {
      for (const def of this.catalogo) {
        const achou = def.keywords.some(kw => nomeNorm.includes(this.normalizarTexto(kw)));
        if (achou) {
          return {
            principal: def.principal,
            secundaria: def.secundaria || null,
            slug: def.slug
          };
        }
      }
    }

    if (item.id && this.idFallbackMap[item.id]) {
      const slug = this.idFallbackMap[item.id];
      const def = this.catalogo.find(c => c.slug === slug);
      if (def) {
        return {
          principal: def.principal,
          secundaria: def.secundaria || null,
          slug: def.slug
        };
      }
    }

    const fotoUnica = item.imagemUrl || item.imagem || item.foto;
    if (fotoUnica) {
      return {
        principal: fotoUnica,
        secundaria: null,
        slug: 'single'
      };
    }

    return null;
  }

  getFotoPrincipal(item: any): string | null {
    const par = this.getFotoPar(item);
    return par ? par.principal : null;
  }

  getFotoSecundaria(item: any): string | null {
    const par = this.getFotoPar(item);
    return par?.secundaria || null;
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .trim();
  }
}
