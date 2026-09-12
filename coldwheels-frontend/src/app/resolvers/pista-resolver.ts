import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';

import { Pista } from '../models/pista.model';
import { PistaService } from '../services/pista.service';

export const pistaResolver: ResolveFn<Pista | RedirectCommand> = (route) => {
  const pistaService = inject(PistaService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const id = Number(route.paramMap.get('id'));

  if (!Number.isInteger(id) || id <= 0) {
    snackBar.open('ID da pista inválido.', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });

    return new RedirectCommand(router.parseUrl('/pistas'));
  }

  return pistaService.findById(id).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensagem = 'Não foi possível carregar a pista.';

      if (error.status === 0) {
        mensagem = 'Não foi possível conectar ao servidor.';
      } else if (error.error?.message) {
        mensagem = error.error.message;
      }

      snackBar.open(mensagem, 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      return of(new RedirectCommand(router.parseUrl('/pistas')));
    })
  );
};