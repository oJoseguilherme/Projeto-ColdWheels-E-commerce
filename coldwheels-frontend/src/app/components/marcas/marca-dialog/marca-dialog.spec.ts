import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarcaDialogComponent } from './marca-dialog';

describe('MarcaDialogComponent', () => {
  let component: MarcaDialogComponent;
  let fixture: ComponentFixture<MarcaDialogComponent>;

  const mockDialogRef = {
    close: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MarcaDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MarcaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve ser instanciado corretamente', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.form.get('nome')).toBeTruthy();
    expect(component.form.get('paisOrigem')).toBeTruthy();
    expect(component.form.get('bandeiraPais')).toBeTruthy();
  });

  it('não deve exibir campo visual de logoUrl no template e deve salvar sem quebrar o backend', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // O campo de URL da imagem/logo foi removido do formulário
    const inputLogo = compiled.querySelector('input[formControlName="logoUrl"]');
    expect(inputLogo).toBeNull();

    component.form.patchValue({
      nome: 'Bburago',
      paisOrigem: 'Itália'
    });

    expect(component.form.valid).toBe(true);
    component.onSalvar();

    expect(mockDialogRef.close).toHaveBeenCalledWith(expect.objectContaining({
      nome: 'Bburago',
      paisOrigem: 'Itália',
      bandeiraPais: '🇮🇹'
    }));
  });
});
