import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap
} from 'rxjs/operators';
import { Cliente } from './models/cliente.model';
import {
  CLIENTE_MIN_CARACTERES,
  CLIENTE_SERVICE
} from './services/cliente.service';
import { ClienteHttpService } from './services/cliente-http.service';
import { MockClienteService } from './services/cliente.mock';
import { formatHttpErrorMessage } from '../../core/utils/http-error';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: CLIENTE_SERVICE,
      useClass: environment.useMock ? MockClienteService : ClienteHttpService
    }
  ],
  templateUrl: './clientes.page.html'
})
export class ClientesPage {
  private readonly clienteService = inject(CLIENTE_SERVICE);

  readonly minCaracteres = CLIENTE_MIN_CARACTERES;
  readonly busqueda = new FormControl('', { nonNullable: true });

  readonly resultados = signal<Cliente[]>([]);
  readonly seleccionado = signal<Cliente | null>(null);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly terminoActual = signal('');

  readonly busquedaSuficiente = computed(
    () => this.terminoActual().trim().length >= CLIENTE_MIN_CARACTERES
  );

  constructor() {
    // Debounce + cancelación de peticiones obsoletas (switchMap).
    this.busqueda.valueChanges
      .pipe(
        // El texto mostrado se actualiza al instante; la petición espera el debounce.
        tap((termino) => this.terminoActual.set(termino)),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.error.set(null);
          this.seleccionado.set(null);
        }),
        switchMap((termino) => {
          const consulta = termino.trim();

          if (consulta.length < CLIENTE_MIN_CARACTERES) {
            this.resultados.set([]);
            this.cargando.set(false);
            return of([] as Cliente[]);
          }

          this.cargando.set(true);

          return this.clienteService.buscar(consulta).pipe(
            catchError((err: unknown) => {
              this.error.set(formatHttpErrorMessage(err));
              return of([] as Cliente[]);
            }),
            finalize(() => this.cargando.set(false))
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe((clientes) => this.resultados.set(clientes));
  }

  seleccionar(cliente: Cliente): void {
    this.seleccionado.set(cliente);
  }

  limpiar(): void {
    this.busqueda.reset('');
    this.resultados.set([]);
    this.seleccionado.set(null);
    this.error.set(null);
    this.cargando.set(false);
  }
}
