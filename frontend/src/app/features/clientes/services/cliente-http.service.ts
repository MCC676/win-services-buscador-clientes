import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { CLIENTE_LIMITE_DEFECTO, ClienteService } from './cliente.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ClienteHttpService implements ClienteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${environment.apiUrl}/clientes/buscar`;

  buscar(termino: string, limite = CLIENTE_LIMITE_DEFECTO): Observable<Cliente[]> {
    const params = new HttpParams()
      .set('q', termino)
      .set('limit', limite);

    return this.http.get<Cliente[]>(this.endpoint, { params });
  }
}
