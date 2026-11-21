import { Directive, ElementRef, HostListener, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPrecoMask]',
  standalone: true
})
export class PrecoMaskDirective implements OnInit {

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    @Optional() private readonly ngControl?: NgControl
  ) {}

  ngOnInit(): void {
    const valorInicial = this.ngControl?.value ?? this.el.nativeElement.value;
    if (valorInicial !== null && valorInicial !== undefined && valorInicial !== '') {
      this.formatarValorNumerico(Number(valorInicial));
    }

    if (this.ngControl?.valueChanges) {
      this.ngControl.valueChanges.subscribe(val => {
        // Se o valor foi atualizado programaticamente externamente
        if (typeof val === 'number') {
          const formatado = this.formatarNumeroParaMoeda(val);
          if (this.el.nativeElement.value !== formatado) {
            this.el.nativeElement.value = formatado;
          }
        }
      });
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const apenasDigitos = (input.value || '').replace(/\D/g, '');

    if (!apenasDigitos) {
      input.value = '';
      this.atualizarModel(null);
      return;
    }

    const centavos = parseInt(apenasDigitos, 10);
    const valorNumerico = centavos / 100;

    const textoFormatado = this.formatarNumeroParaMoeda(valorNumerico);
    input.value = textoFormatado;

    this.atualizarModel(valorNumerico);
  }

  @HostListener('blur')
  onBlur(): void {
    const valorAtual = this.el.nativeElement.value;
    if (valorAtual) {
      const apenasDigitos = valorAtual.replace(/\D/g, '');
      if (apenasDigitos) {
        const valorNumerico = parseInt(apenasDigitos, 10) / 100;
        this.el.nativeElement.value = this.formatarNumeroParaMoeda(valorNumerico);
        this.atualizarModel(valorNumerico);
      }
    }
  }

  private formatarValorNumerico(numero: number): void {
    if (isNaN(numero)) {
      return;
    }
    const formatado = this.formatarNumeroParaMoeda(numero);
    this.el.nativeElement.value = formatado;
  }

  private formatarNumeroParaMoeda(numero: number): string {
    return numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private atualizarModel(valor: number | null): void {
    if (this.ngControl && this.ngControl.control) {
      if (this.ngControl.control.value !== valor) {
        this.ngControl.control.setValue(valor, { emitModelToViewChange: false });
      }
    }
  }
}
