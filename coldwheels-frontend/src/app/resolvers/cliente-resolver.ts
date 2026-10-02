import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  RedirectCommand,
  ResolveFn,
  Router
} from '@angular/router';
import { catchError, of } from 'rxjs';

import { Cliente } from '../models/cliente.model';
import { ClienteService } from '../services/cliente.service';

export const clienteResolver: ResolveFn<Cliente | RedirectCommand> = (route) => {
  const clienteService = inject(ClienteService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const id = Number(route.paramMap.get('id'));

  if (!Number.isInteger(id) || id <= 0) {
    snackBar.open('ID do cliente inválido.', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    return new RedirectCommand(router.parseUrl('/clientes'));
  }

  return clienteService.findById(id).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensagem = 'Não foi possível carregar o cliente.';

      if (error.status === 0) {
        mensagem = 'Não foi possível conectar ao servidor.';
      } else if (
        typeof error.error === 'object' &&
        error.error !== null &&
        typeof error.error.message === 'string'
      ) {
        mensagem = error.error.message;
      }

      snackBar.open(mensagem, 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      return of(new RedirectCommand(router.parseUrl('/clientes')));
    })
  );
};
