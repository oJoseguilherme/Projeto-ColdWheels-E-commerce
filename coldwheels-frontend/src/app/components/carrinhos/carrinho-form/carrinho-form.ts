import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CarrinhoService } from '../../../services/carrinho.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-carrinho-form',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './carrinho-form.html',
  styleUrl: './carrinho-form.css',
})
export class CarrinhoForm implements OnInit {
  readonly form: FormGroup;
  categorias: Categoria[] = [];
  private readonly location = inject(Location);

  constructor(
    private fb: FormBuilder,
    private carrinhoService: CarrinhoService,
    private categoriaService: CategoriaService,
    private activatedRoute: ActivatedRoute,
    private snack: MatSnackBar,
    private router: Router
  ) {
    // Definimos os campos do formulário e validações
    this.form = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      descricao: [''],
      idCategoria: [null, [Validators.required]],
      escala: ['1:64', [Validators.required]],
      anoLancamento: [new Date().getFullYear(), [Validators.required]],
      cor: ['', [Validators.required]],
      preco: [null, [Validators.required, Validators.min(0.01)]],
      estoque: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarCategorias();

    // Se estiver editando, o Resolver entrega o carrinho aqui!
    const carrinho = this.activatedRoute.snapshot.data['carrinho'];
    if (carrinho) {
      this.form.patchValue({
        ...carrinho,
        idCategoria: carrinho.categoria ? carrinho.categoria.id : null
      });
    }
  }

  carregarCategorias(): void {
    this.categoriaService.findAll().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
        this.exibirMensagem('Erro ao carregar categorias.');
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.exibirMensagem('Preencha todos os campos obrigatórios!');
      return;
    }

    const dados = this.form.value;

    if (dados.id) {
      // Caso de Edição (update)
      this.carrinhoService.update(dados.id, dados).subscribe({
        next: () => {
          this.exibirMensagem('Carrinho atualizado com sucesso!');
          this.router.navigate(['/carrinhos']);
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          this.exibirMensagem('Erro ao atualizar o carrinho.');
        }
      });
    } else {
      // Caso de Criação (create)
      this.carrinhoService.create(dados).subscribe({
        next: () => {
          this.exibirMensagem('Carrinho cadastrado com sucesso!');
          this.router.navigate(['/carrinhos']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar:', err);
          this.exibirMensagem('Erro ao cadastrar o carrinho.');
        }
      });
    }
  }

  excluir(): void {
    const id = this.form.value.id;
    if (id && confirm('Deseja realmente excluir este carrinho?')) {
      this.carrinhoService.delete(id).subscribe({
        next: () => {
          this.exibirMensagem('Carrinho excluído com sucesso!');
          this.router.navigate(['/carrinhos']);
        },
        error: (err) => {
          console.error('Erro ao excluir:', err);
          this.exibirMensagem('Erro ao excluir o carrinho.');
        }
      });
    }
  }

  exibirMensagem(msg: string): void {
    this.snack.open(msg, 'Ok', {
      duration: 2500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  voltar(): void {
    this.location.back();
  }
}
