import { Directive, ElementRef, HostListener, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCnpjMask]',
  standalone: true
})
export class CnpjMaskDirective implements OnInit {

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    @Optional() private readonly ngControl?: NgControl
  ) {}

  ngOnInit(): void {
    if (this.el.nativeElement.value) {
      this.formatar(this.el.nativeElement.value);
    } else if (this.ngControl?.value) {
      this.formatar(String(this.ngControl.value));
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.formatar(input.value);
  }

  @HostListener('blur')
  onBlur(): void {
    if (this.el.nativeElement.value) {
      this.formatar(this.el.nativeElement.value);
    }
  }

  private formatar(valor: string): void {
    const apenasDigitos = (valor || '').replace(/\D/g, '').slice(0, 14);
    let formatado = apenasDigitos;

    if (apenasDigitos.length > 12) {
      formatado = `${apenasDigitos.slice(0, 2)}.${apenasDigitos.slice(2, 5)}.${apenasDigitos.slice(5, 8)}/${apenasDigitos.slice(8, 12)}-${apenasDigitos.slice(12)}`;
    } else if (apenasDigitos.length > 8) {
      formatado = `${apenasDigitos.slice(0, 2)}.${apenasDigitos.slice(2, 5)}.${apenasDigitos.slice(5, 8)}/${apenasDigitos.slice(8)}`;
    } else if (apenasDigitos.length > 5) {
      formatado = `${apenasDigitos.slice(0, 2)}.${apenasDigitos.slice(2, 5)}.${apenasDigitos.slice(5)}`;
    } else if (apenasDigitos.length > 2) {
      formatado = `${apenasDigitos.slice(0, 2)}.${apenasDigitos.slice(2)}`;
    }

    this.el.nativeElement.value = formatado;

    if (this.ngControl && this.ngControl.control) {
      if (this.ngControl.control.value !== formatado) {
        this.ngControl.control.setValue(formatado, { emitModelToViewChange: false });
      }
    }
  }
}
