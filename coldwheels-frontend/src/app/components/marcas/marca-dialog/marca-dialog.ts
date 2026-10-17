import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Marca } from '../../../services/marca.service';

export interface MarcaDialogData {
  marca?: Marca;
}

@Component({
  selector: 'app-marca-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './marca-dialog.html',
  styleUrl: './marca-dialog.css'
})
export class MarcaDialogComponent implements OnInit {
  form: FormGroup;
  modoEdicao: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MarcaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MarcaDialogData
  ) {
    this.modoEdicao = !!data?.marca;

    this.form = this.fb.group({
      id: [data?.marca?.id || null],
      nome: [data?.marca?.nome || '', [Validators.required]],
      paisOrigem: [data?.marca?.paisOrigem || '', [Validators.required]],
      bandeiraPais: [data?.marca?.bandeiraPais || ''],
      logoUrl: [data?.marca?.logoUrl || '']
    });
  }

  ngOnInit(): void {}

  private resolverBandeira(pais: string): string {
    const p = pais.toLowerCase().trim();
    if (p.includes('estados unidos') || p.includes('eua') || p.includes('usa')) return '🇺🇸';
    if (p.includes('brasil')) return '🇧🇷';
    if (p.includes('reino unido') || p.includes('inglaterra') || p.includes('uk')) return '🇬🇧';
    if (p.includes('frança') || p.includes('france')) return '🇫🇷';
    if (p.includes('japão') || p.includes('japan')) return '🇯🇵';
    if (p.includes('alemanha') || p.includes('germany')) return '🇩🇪';
    if (p.includes('itália') || p.includes('italy')) return '🇮🇹';
    if (p.includes('espanha') || p.includes('spain')) return '🇪🇸';
    if (p.includes('china')) return '🇨🇳';
    if (p.includes('canadá') || p.includes('canada')) return '🇨🇦';
    return '🌐';
  }

  onSalvar(): void {
    if (this.form.invalid) {
      return;
    }

    const valor = this.form.value;
    const bandeira = valor.bandeiraPais?.trim() || this.resolverBandeira(valor.paisOrigem);

    this.dialogRef.close({
      ...valor,
      bandeiraPais: bandeira
    });
  }

  onCancelar(): void {
    this.dialogRef.close(null);
  }
}
