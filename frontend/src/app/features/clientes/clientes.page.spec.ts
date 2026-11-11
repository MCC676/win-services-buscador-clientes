import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ClientesPage } from './clientes.page';
import { CLIENTE_SERVICE } from './services/cliente.service';
import { MockClienteService } from './services/cliente.mock';

describe('ClientesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ClientesPage] })
      .overrideComponent(ClientesPage, {
        set: {
          providers: [{ provide: CLIENTE_SERVICE, useClass: MockClienteService }]
        }
      })
      .compileComponents();
  });

  it('debe crear el componente sin resultados iniciales', () => {
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
    expect(component.resultados()).toEqual([]);
    expect(component.seleccionado()).toBeNull();
    expect(component.busquedaSuficiente()).toBe(false);
  });

  it('debe seleccionar un cliente para mostrar su ficha', () => {
    const fixture = TestBed.createComponent(ClientesPage);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const cliente = {
      id: 1,
      tipoDocumento: 'RUC',
      numeroDocumento: '20556677881',
      razonSocial: 'WIN TELECOMUNICACIONES S.A.C.',
      segmento: 'CORPORATIVO',
      correo: 'contacto@win.pe'
    };

    component.seleccionar(cliente);

    expect(component.seleccionado()).toEqual(cliente);
  });
});

describe('MockClienteService', () => {
  const service = new MockClienteService();

  it('busca por prefijo de número de documento', async () => {
    const resultados = await firstValueFrom(service.buscar('2055'));

    expect(resultados.length).toBe(1);
    expect(resultados[0].numeroDocumento).toBe('20556677881');
  });

  it('busca por razón social sin distinguir mayúsculas', async () => {
    const resultados = await firstValueFrom(service.buscar('banco'));

    expect(resultados.length).toBe(1);
    expect(resultados[0].razonSocial).toContain('BANCO');
  });

  it('respeta el límite de resultados y ordena por razón social', async () => {
    const resultados = await firstValueFrom(service.buscar('S.A.C.', 2));

    expect(resultados.length).toBe(2);
    expect(resultados[0].razonSocial.localeCompare(resultados[1].razonSocial, 'es')).toBeLessThan(0);
  });
});
