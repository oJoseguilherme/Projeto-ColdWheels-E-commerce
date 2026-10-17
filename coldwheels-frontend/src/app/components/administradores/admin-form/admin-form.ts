import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-admin-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-form.html',
  styleUrl: './admin-form.css'
})
export class AdminForm implements OnInit {
  form!: FormGroup;
  salvando: boolean = false;
  ocultarSenha: boolean = true;
  ocultarConfirmacao: boolean = true;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      cargo: ['Administrador Geral', Validators.required],
      nivelPermissao: ['SUPER_ADMIN', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validators: this.senhasIguaisValidator });
  }

  senhasIguaisValidator(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmacao = group.get('confirmarSenha')?.value;
    return senha === confirmacao ? null : { senhasDiferentes: true };
  }

  salvar(): void {
    if (this.form.invalid) {
      this.snackBar.open('Preencha todos os campos corretamente.', 'Aviso', { duration: 3000 });
      return;
    }

    this.salvando = true;
    const { nome, email, cargo, nivelPermissao, senha } = this.form.value;

    this.adminService.criarAdministrador({ nome, email, cargo, nivelPermissao, senha }).subscribe({
      next: () => {
        this.snackBar.open('Administrador cadastrado com sucesso!', 'Ok', { duration: 2500 });
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.salvando = false;
        this.snackBar.open('Erro ao cadastrar administrador.', 'Fechar', { duration: 3000 });
      }
    });
  }
}
