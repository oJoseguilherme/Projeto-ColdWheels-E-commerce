import { Directive, ElementRef, HostListener, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appIdadeMinimaMask]',
  standalone: true
})
export class IdadeMinimaMaskDirective implements OnInit {

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    @Optional() private readonly ngControl?: NgControl
  ) {}

  ngOnInit(): void {
    const valorInicial = this.ngControl?.value ?? this.el.nativeElement.value;
    if (valorInicial !== null && valorInicial !== undefined && valorInicial !== '') {
      const num = parseInt(String(valorInicial).replace(/\D/g, ''), 10);
      if (!isNaN(num) && num > 0) {
        this.el.nativeElement.value = String(num);
      }
    }

    if (this.ngControl?.valueChanges) {
      this.ngControl.valueChanges.subscribe(val => {
        if (typeof val === 'number') {
          const str = String(val);
          if (this.el.nativeElement.value !== str) {
            this.el.nativeElement.value = str;
          }
        }
      });
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const apenasDigitos = (input.value || '').replace(/\D/g, '').slice(0, 2);

    if (!apenasDigitos) {
      input.value = '';
      this.atualizarModel(null);
      return;
    }

    const valorNumerico = parseInt(apenasDigitos, 10);
    input.value = String(valorNumerico);
    this.atualizarModel(valorNumerico);
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const apenasDigitos = (input.value || '').replace(/\D/g, '').slice(0, 2);
    if (!apenasDigitos) {
      input.value = '';
      this.atualizarModel(null);
      return;
    }
    const valorNumerico = parseInt(apenasDigitos, 10);
    input.value = String(valorNumerico);
    this.atualizarModel(valorNumerico);
  }

  private atualizarModel(valor: number | null): void {
    if (this.ngControl && this.ngControl.control) {
      if (this.ngControl.control.value !== valor) {
        this.ngControl.control.setValue(valor, { emitModelToViewChange: false });
      }
    }
  }
}
