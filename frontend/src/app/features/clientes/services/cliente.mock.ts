import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/mock/mock-api';
import { Cliente } from '../models/cliente.model';
import { CLIENTE_LIMITE_DEFECTO, ClienteService } from './cliente.service';

/**
 * Implementación en memoria para desarrollo sin backend.
 * Replica la lógica del stored procedure: documento por prefijo o
 * razón social por coincidencia parcial, solo clientes activos.
 */
@Injectable()
export class MockClienteService implements ClienteService {
  private readonly clientes: Cliente[] = [
    {
      id: 1,
      tipoDocumento: 'RUC',
      numeroDocumento: '20556677881',
      razonSocial: 'WIN TELECOMUNICACIONES S.A.C.',
      segmento: 'CORPORATIVO',
      correo: 'contacto@win.pe'
    },
    {
      id: 2,
      tipoDocumento: 'RUC',
      numeroDocumento: '20100047218',
      razonSocial: 'BANCO DE CREDITO DEL PERU',
      segmento: 'CORPORATIVO',
      correo: 'empresas@bcp.com.pe'
    },
    {
      id: 3,
      tipoDocumento: 'RUC',
      numeroDocumento: '20492145789',
      razonSocial: 'INVERSIONES TECNOLOGICAS LIMA SUR S.A.C.',
      segmento: 'PYME',
      correo: 'gerencia@inversur.pe'
    },
    {
      id: 4,
      tipoDocumento: 'DNI',
      numeroDocumento: '45892310',
      razonSocial: 'CARLOS ALBERTO MENESES ROJAS',
      segmento: 'RESIDENCIAL',
      correo: 'cmeneses@gmail.com'
    },
    {
      id: 5,
      tipoDocumento: 'DNI',
      numeroDocumento: '72341908',
      razonSocial: 'MARIA FERNANDA TORRES CASTILLO',
      segmento: 'RESIDENCIAL',
      correo: 'mftorres@outlook.com'
    },
    {
      id: 6,
      tipoDocumento: 'DNI',
      numeroDocumento: '41229876',
      razonSocial: 'JORGE LUIS VALDIVIA SALAZAR',
      segmento: 'RESIDENCIAL',
      correo: 'jvaldivia@yahoo.com'
    },
    {
      id: 7,
      tipoDocumento: 'RUC',
      numeroDocumento: '20601234991',
      razonSocial: 'CONSTRUCTORA Y SERVICIOS GENERALES ANDINA E.I.R.L.',
      segmento: 'PYME',
      correo: 'logistica@andina.pe'
    }
  ];

  buscar(termino: string, limite = CLIENTE_LIMITE_DEFECTO): Observable<Cliente[]> {
    const consulta = termino.trim();
    const consultaUpper = consulta.toUpperCase();
    const documento = consulta.replace(/\s/g, '');

    const resultados = this.clientes
      .filter(
        (cliente) =>
          cliente.numeroDocumento.startsWith(documento) ||
          cliente.razonSocial.toUpperCase().includes(consultaUpper)
      )
      .sort((a, b) => a.razonSocial.localeCompare(b.razonSocial, 'es'))
      .slice(0, limite);

    return mockResponse(resultados);
  }
}
