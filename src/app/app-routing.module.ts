import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'metadados/:codProjeto',
    loadChildren: () =>
      import('./metadados/metadados.module').then((m) => m.MetadadosModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
