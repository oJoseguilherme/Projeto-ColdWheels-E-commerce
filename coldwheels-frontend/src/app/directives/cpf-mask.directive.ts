import { Directive, ElementRef, HostListener, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfMask]',
  standalone: true
})
export class CpfMaskDirective implements OnInit {

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
    const apenasDigitos = (valor || '').replace(/\D/g, '').slice(0, 11);
    let formatado = apenasDigitos;

    if (apenasDigitos.length > 9) {
      formatado = `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6, 9)}-${apenasDigitos.slice(9)}`;
    } else if (apenasDigitos.length > 6) {
      formatado = `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3, 6)}.${apenasDigitos.slice(6)}`;
    } else if (apenasDigitos.length > 3) {
      formatado = `${apenasDigitos.slice(0, 3)}.${apenasDigitos.slice(3)}`;
    }

    this.el.nativeElement.value = formatado;

    if (this.ngControl && this.ngControl.control) {
      if (this.ngControl.control.value !== formatado) {
        this.ngControl.control.setValue(formatado, { emitModelToViewChange: false });
      }
    }
  }
}
