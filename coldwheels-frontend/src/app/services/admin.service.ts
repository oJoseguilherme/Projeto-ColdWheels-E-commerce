import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AdminPayload {
  nome: string;
  email: string;
  cargo: string;
  nivelPermissao: 'SUPER_ADMIN' | 'GERENTE_ESTOQUE' | 'OPERADOR';
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  criarAdministrador(payload: AdminPayload): Observable<{ success: boolean; id: number }> {
    console.log('🛡️ [AdminService] Payload de Novo Administrador pronto para o Backend:', {
      nome: payload.nome,
      email: payload.email,
      cargo: payload.cargo,
      nivelPermissao: payload.nivelPermissao,
      senha: '***' // Segurança: nunca logar a senha real
    });

    return of({ success: true, id: Date.now() });
  }
}
