import { Routes } from '@angular/router';

// El entregable es únicamente el buscador de clientes: se deja como pantalla
// principal y se retiran las rutas de demostración (dashboard, ejemplo).
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'clientes',
    pathMatch: 'full'
  },
  {
    path: 'clientes',
    loadComponent: () => import('./features/clientes/clientes.page').then(m => m.ClientesPage)
  },
  {
    path: '**',
    redirectTo: 'clientes'
  }
];
