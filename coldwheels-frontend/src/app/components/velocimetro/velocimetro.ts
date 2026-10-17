import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface Ponto {
  x: number;
  y: number;
}

export interface LinhaDivisao {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

@Component({
  selector: 'app-velocimetro',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './velocimetro.html',
  styleUrl: './velocimetro.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VelocimetroComponent implements OnInit, OnChanges, OnDestroy {
  @Input() titulo: string = '';
  @Input() valor: number = 0;
  @Input() tipo: 'moeda' | 'numero' = 'numero';
  @Input() icone: string = 'speed';
  @Input() unidade: string = '';
  @Input() iconeClasse: string = 'default-icon';

  // Configurações geométricas do mostrador (compatíveis com a imagem de referência)
  readonly cx = 160;
  readonly cy = 160;
  readonly rOut = 130;
  readonly rIn = 88;
  readonly anguloInicio = 140; // Ângulo inferior esquerdo (em graus)
  readonly anguloFim = 400;    // Ângulo inferior direito (260 graus de amplitude total)
  readonly amplitudeAngular = 260;
  readonly totalDivisoes = 10; // 10 segmentos principais divididos por traços

  // Estado da Escala
  escalaMaxima: number = 100;
  escalaMaximaFormatada: string = '100';

  // Estado da Animação
  valorExibido: number = 0;
  valorFormatado: string = '0';
  anguloPonteiro: number = 140;
  arcoAtivoPath: string = '';
  arcoFundoPath: string = '';
  bordaExternaPath: string = '';
  divisoes: LinhaDivisao[] = [];
  ponteiroP1: Ponto = { x: 0, y: 0 };
  ponteiroP2: Ponto = { x: 0, y: 0 };

  private animacaoId: number | null = null;
  private animacaoInicio: number | null = null;
  private valorOrigem: number = 0;
  private readonly duracaoAnimacaoMs = 1500; // 1.5s de movimento fluido e imersivo original restaurado

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.construirGeometriaFixa();
    this.atualizarEscala();
    this.iniciarAnimacao(0, this.valor);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['valor'] && !changes['valor'].isFirstChange()) {
      const valorAnterior = this.valorExibido;
      const novoValor = Number(changes['valor'].currentValue) || 0;
      this.atualizarEscala();
      this.iniciarAnimacao(valorAnterior, novoValor);
    }
  }

  ngOnDestroy(): void {
    this.cancelarAnimacao();
  }

  /**
   * Constrói os elementos geométricos estáticos do SVG (arco de fundo, contorno e divisões radiais).
   */
  private construirGeometriaFixa(): void {
    this.arcoFundoPath = this.gerarArcoSegmentado(
      this.cx,
      this.cy,
      this.rIn,
      this.rOut,
      this.anguloInicio,
      this.anguloFim
    );

    // Contorno externo contínuo com cantos arredondados na base
    this.bordaExternaPath = this.gerarBordaExterna(
      this.cx,
      this.cy,
      this.rIn,
      this.rOut,
      this.anguloInicio,
      this.anguloFim
    );

    // Linhas de graduação pretas segmentando o mostrador como na imagem de referência
    this.divisoes = [];
    const passoAngular = this.amplitudeAngular / this.totalDivisoes;
    for (let i = 1; i < this.totalDivisoes; i++) {
      const angulo = this.anguloInicio + i * passoAngular;
      const pInterno = this.polarParaCartesiano(this.cx, this.cy, this.rIn, angulo);
      const pExterno = this.polarParaCartesiano(this.cx, this.cy, this.rOut, angulo);
      this.divisoes.push({
        x1: pInterno.x,
        y1: pInterno.y,
        x2: pExterno.x,
        y2: pExterno.y
      });
    }
  }

  /**
   * Calcula dinamicamente uma escala máxima inteligente e proporcional ("nice numbers")
   * para que o ponteiro sempre ocupe uma posição equilibrada e elegante (~55% a ~75%).
   */
  private atualizarEscala(): void {
    const val = Math.max(0, Number(this.valor) || 0);

    if (val === 0) {
      this.escalaMaxima = this.tipo === 'moeda' ? 10000 : 100;
    } else {
      // Alvo ideal: o valor preenche ~68% do velocímetro
      const alvo = val / 0.68;
      const expoente = Math.floor(Math.log10(alvo));
      const magnitude = Math.pow(10, expoente);
      const fracao = alvo / magnitude;

      let mult = 1;
      if (fracao <= 1.2) mult = 1.2;
      else if (fracao <= 1.5) mult = 1.5;
      else if (fracao <= 2.0) mult = 2.0;
      else if (fracao <= 2.5) mult = 2.5;
      else if (fracao <= 3.0) mult = 3.0;
      else if (fracao <= 4.0) mult = 4.0;
      else if (fracao <= 5.0) mult = 5.0;
      else if (fracao <= 6.0) mult = 6.0;
      else if (fracao <= 8.0) mult = 8.0;
      else mult = 10.0;

      this.escalaMaxima = Math.max(val, Math.round(mult * magnitude));
    }

    this.escalaMaximaFormatada = this.formatarLimiteEscala(this.escalaMaxima);
  }

  /**
   * Inicia o ciclo de animação via requestAnimationFrame fora da zona do Angular.
   */
  private iniciarAnimacao(deValor: number, paraValor: number): void {
    this.cancelarAnimacao();
    this.valorOrigem = deValor;

    // Respeita preferência por movimento reduzido (acessibilidade)
    const prefereReducaoMovimento =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefereReducaoMovimento) {
      this.aplicarProgresso(1, paraValor);
      this.cdr.detectChanges();
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      const step = (timestamp: number) => {
        if (!this.animacaoInicio) {
          this.animacaoInicio = timestamp;
        }

        const decorrido = timestamp - this.animacaoInicio;
        const progressoLinear = Math.min(1, decorrido / this.duracaoAnimacaoMs);
        // Easing cúbico natural de desaceleração esportiva
        const progressoSuave = this.easeOutCubic(progressoLinear);

        const valorAtual = this.valorOrigem + (paraValor - this.valorOrigem) * progressoSuave;
        this.aplicarProgresso(progressoSuave, valorAtual);

        this.cdr.detectChanges();

        if (progressoLinear < 1) {
          this.animacaoId = requestAnimationFrame(step);
        } else {
          this.animacaoId = null;
          this.animacaoInicio = null;
        }
      };

      this.animacaoId = requestAnimationFrame(step);
    });
  }

  private cancelarAnimacao(): void {
    if (this.animacaoId !== null) {
      cancelAnimationFrame(this.animacaoId);
      this.animacaoId = null;
    }
    this.animacaoInicio = null;
  }

  /**
   * Atualiza a geometria e formatação visual sincronizada em cada frame.
   */
  private aplicarProgresso(progresso: number, valorAtual: number): void {
    this.valorExibido = valorAtual;
    this.valorFormatado = this.formatarValorPrincipal(valorAtual);

    const proporcao = this.escalaMaxima > 0 ? Math.min(1, Math.max(0, valorAtual / this.escalaMaxima)) : 0;
    this.anguloPonteiro = this.anguloInicio + proporcao * this.amplitudeAngular;

    // Constrói o arco preenchido ativo até o ponteiro
    if (proporcao > 0.002) {
      this.arcoAtivoPath = this.gerarArcoSegmentado(
        this.cx,
        this.cy,
        this.rIn,
        this.rOut,
        this.anguloInicio,
        this.anguloPonteiro
      );
    } else {
      this.arcoAtivoPath = '';
    }

    // Coordenadas da agulha (needle) branca reluzente
    this.ponteiroP1 = this.polarParaCartesiano(this.cx, this.cy, this.rIn - 2, this.anguloPonteiro);
    this.ponteiroP2 = this.polarParaCartesiano(this.cx, this.cy, this.rOut + 3, this.anguloPonteiro);
  }

  /**
   * Curva de aceleração e desaceleração aerodinâmica fluida.
   */
  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  /**
   * Converte coordenadas polares em cartesianas.
   */
  private polarParaCartesiano(cx: number, cy: number, r: number, anguloDeg: number): Ponto {
    const rad = (anguloDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }

  /**
   * Gera o caminho SVG em arco com espessura (anel fatiado).
   */
  private gerarArcoSegmentado(
    cx: number,
    cy: number,
    rIn: number,
    rOut: number,
    inicioDeg: number,
    fimDeg: number
  ): string {
    const p1 = this.polarParaCartesiano(cx, cy, rOut, inicioDeg);
    const p2 = this.polarParaCartesiano(cx, cy, rOut, fimDeg);
    const p3 = this.polarParaCartesiano(cx, cy, rIn, fimDeg);
    const p4 = this.polarParaCartesiano(cx, cy, rIn, inicioDeg);

    const largeArc = fimDeg - inicioDeg > 180 ? 1 : 0;

    return [
      `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
      `A ${rOut} ${rOut} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
      `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
      `A ${rIn} ${rIn} 0 ${largeArc} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
      'Z'
    ].join(' ');
  }

  /**
   * Gera o contorno contínuo externo do mostrador com cantos arredondados na base.
   */
  private gerarBordaExterna(
    cx: number,
    cy: number,
    rIn: number,
    rOut: number,
    inicioDeg: number,
    fimDeg: number
  ): string {
    const pOutInicio = this.polarParaCartesiano(cx, cy, rOut, inicioDeg);
    const pOutFim = this.polarParaCartesiano(cx, cy, rOut, fimDeg);
    const pInFim = this.polarParaCartesiano(cx, cy, rIn, fimDeg);
    const pInInicio = this.polarParaCartesiano(cx, cy, rIn, inicioDeg);

    return [
      `M ${pInInicio.x.toFixed(2)} ${pInInicio.y.toFixed(2)}`,
      `L ${pOutInicio.x.toFixed(2)} ${pOutInicio.y.toFixed(2)}`,
      `A ${rOut} ${rOut} 0 1 1 ${pOutFim.x.toFixed(2)} ${pOutFim.y.toFixed(2)}`,
      `L ${pInFim.x.toFixed(2)} ${pInFim.y.toFixed(2)}`
    ].join(' ');
  }

  /**
   * Formatação monetária (BRL) ou numérica inteira com separadores de milhar.
   */
  private formatarValorPrincipal(valor: number): string {
    if (this.tipo === 'moeda') {
      return Math.round(valor).toLocaleString('pt-BR');
    }
    return Math.round(valor).toLocaleString('pt-BR');
  }

  /**
   * Formata os valores exibidos nos limites da escala (ex.: 50k, 150, 200).
   */
  private formatarLimiteEscala(valor: number): string {
    if (this.tipo === 'moeda') {
      if (valor >= 1000000) {
        return (valor / 1000000).toFixed(1).replace('.0', '') + 'M';
      }
      if (valor >= 1000) {
        return (valor / 1000).toFixed(0) + 'k';
      }
      return valor.toString();
    }

    if (valor >= 1000) {
      return (valor / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return valor.toString();
  }
}
