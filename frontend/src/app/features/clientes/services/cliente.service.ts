import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

/** Cantidad mínima de caracteres para disparar la búsqueda (regla del backend). */
export const CLIENTE_MIN_CARACTERES = 3;

/** Cantidad máxima de resultados solicitada por defecto. */
export const CLIENTE_LIMITE_DEFECTO = 10;

export interface ClienteService {
  buscar(termino: string, limite?: number): Observable<Cliente[]>;
}

export const CLIENTE_SERVICE = new InjectionToken<ClienteService>('CLIENTE_SERVICE');
