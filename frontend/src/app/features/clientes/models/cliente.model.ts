export interface Cliente {
  readonly id: number;
  readonly tipoDocumento: string;
  readonly numeroDocumento: string;
  readonly razonSocial: string;
  readonly segmento: string;
  readonly correo: string;
}
