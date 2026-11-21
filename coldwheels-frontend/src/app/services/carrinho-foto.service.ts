import { Injectable, inject } from '@angular/core';
import { ArquivoService } from './arquivo.service';

export interface FotoPar {
  frente: string;
  traseira: string;
  slug: string;
}

interface CatalogoFotoDef {
  slug: string;
  keywords: string[];
  frente: string;
  traseira: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoFotoService {
  private readonly arquivoService = inject(ArquivoService);

  private readonly catalogo: CatalogoFotoDef[] = [
    {
      slug: 'ferrari-testarossa',
      keywords: ['testarossa', 'ferrari'],
      frente: 'assets/images/carrinhos/ferrari-testarossa/frente.webp',
      traseira: 'assets/images/carrinhos/ferrari-testarossa/traseira.webp'
    },
    {
      slug: 'pininfarina-battista',
      keywords: ['pininfarina', 'battista', 'eurospeed'],
      frente: 'assets/images/carrinhos/pininfarina-battista/frente.webp',
      traseira: 'assets/images/carrinhos/pininfarina-battista/traseira.webp'
    },
    {
      slug: 'porsche-930',
      keywords: ['porsche', '930', 'rwb'],
      frente: 'assets/images/carrinhos/porsche-930/frente.webp',
      traseira: 'assets/images/carrinhos/porsche-930/traseira.webp'
    },
    {
      slug: 'mustang-svo',
      keywords: ['mustang svo', '84 mustang', 'svo'],
      frente: 'assets/images/carrinhos/mustang-svo/frente.webp',
      traseira: 'assets/images/carrinhos/mustang-svo/traseira.webp'
    },
    {
      slug: 'bmw-m3',
      keywords: ['bmw m3', 'bmw'],
      frente: 'assets/images/carrinhos/bmw-m3/frente.webp',
      traseira: 'assets/images/carrinhos/bmw-m3/traseira.webp'
    },
    {
      slug: 'lancia-stratos',
      keywords: ['lancia', 'stratos'],
      frente: 'assets/images/carrinhos/lancia-stratos/frente.webp',
      traseira: 'assets/images/carrinhos/lancia-stratos/traseira.webp'
    },
    {
      slug: 'shelby-cobra',
      keywords: ['shelby', 'cobra', '427'],
      frente: 'assets/images/carrinhos/shelby-cobra/frente.webp',
      traseira: 'assets/images/carrinhos/shelby-cobra/traseira.webp'
    },
    {
      slug: 'meyers-manx',
      keywords: ['meyers', 'manx', 'boulevard'],
      frente: 'assets/images/carrinhos/meyers-manx/frente.webp',
      traseira: 'assets/images/carrinhos/meyers-manx/traseira.webp'
    },
    {
      slug: 'toyota-land-cruiser',
      keywords: ['land cruiser', 'toyota'],
      frente: 'assets/images/carrinhos/toyota-land-cruiser/frente.webp',
      traseira: 'assets/images/carrinhos/toyota-land-cruiser/traseira.webp'
    },
    {
      slug: 'mustang-rtr',
      keywords: ['mustang rtr', 'spec 5', 'spec 5-fd', 'drift'],
      frente: 'assets/images/carrinhos/mustang-rtr/frente.webp',
      traseira: 'assets/images/carrinhos/mustang-rtr/traseira.webp'
    }
  ];

  // Mapeamento de fallback por ID gerado no banco de dados
  private readonly idFallbackMap: Record<number, string> = {
    1: 'ferrari-testarossa',
    2: 'pininfarina-battista',
    3: 'porsche-930',
    4: 'mustang-svo',
    5: 'bmw-m3',
    6: 'lancia-stratos',
    7: 'shelby-cobra',
    8: 'meyers-manx',
    9: 'toyota-land-cruiser',
    10: 'mustang-rtr',
    18: 'ferrari-testarossa',
    19: 'pininfarina-battista',
    20: 'porsche-930',
    21: 'mustang-svo',
    22: 'bmw-m3',
    23: 'lancia-stratos',
    24: 'shelby-cobra',
    25: 'meyers-manx',
    26: 'toyota-land-cruiser',
    27: 'mustang-rtr'
  };

  /**
   * Obtém o par de fotos (frente e traseira) para o carrinho correspondente.
   */
  getFotoPar(item: any): FotoPar | null {
    if (!item) return null;

    // Se já tiver URLs customizadas diretamente no objeto (ex: S3 via /arquivos/{id})
    if (item.imagemUrl || item.imagemSecundariaUrl) {
      const principal = this.arquivoService.resolverUrlExibicao(item.imagemUrl) || '';
      const secundaria = this.arquivoService.resolverUrlExibicao(item.imagemSecundariaUrl) || principal;
      return {
        frente: principal,
        traseira: secundaria,
        slug: 'custom'
      };
    }

    // Normalização e busca por palavras-chave no nome do carrinho
    const nomeNorm = this.normalizarTexto(item.nome || '');
    if (nomeNorm) {
      for (const def of this.catalogo) {
        const achou = def.keywords.some(kw => nomeNorm.includes(this.normalizarTexto(kw)));
        if (achou) {
          return {
            frente: item.imagemUrl || def.frente,
            traseira: item.imagemSecundariaUrl || def.traseira,
            slug: def.slug
          };
        }
      }
    }

    // Fallback por ID caso o nome tenha sido alterado
    if (item.id && this.idFallbackMap[item.id]) {
      const slug = this.idFallbackMap[item.id];
      const def = this.catalogo.find(c => c.slug === slug);
      if (def) {
        return {
          frente: item.imagemUrl || def.frente,
          traseira: item.imagemSecundariaUrl || def.traseira,
          slug: def.slug
        };
      }
    }

    // Se tem apenas foto única (legado)
    const fotoUnica = item.imagemUrl || item.imagem || item.foto;
    if (fotoUnica) {
      return {
        frente: fotoUnica,
        traseira: fotoUnica,
        slug: 'single'
      };
    }

    return null;
  }

  /**
   * Obtém a foto principal (frente)
   */
  getFotoPrincipal(item: any): string | null {
    const par = this.getFotoPar(item);
    return par ? par.frente : null;
  }

  /**
   * Obtém a foto secundária (traseira)
   */
  getFotoSecundaria(item: any): string | null {
    const par = this.getFotoPar(item);
    return par ? par.traseira : null;
  }

  private normalizarTexto(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .trim();
  }
}
