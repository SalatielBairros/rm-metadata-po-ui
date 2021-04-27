import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormularioDinamicoComponent } from "./formulario-dinamico/formulario-dinamico.component";
import { VisualizacaoDinamicaComponent } from "./visualizacao-dinamica/visualizacao-dinamica.component";

const routes: Routes = [
  {
    path: 'form/:id',
    component: FormularioDinamicoComponent,
  },
  {
    path: 'form',
    component: FormularioDinamicoComponent,
  },
  {
    path: 'list',
    component: VisualizacaoDinamicaComponent,
  },
  {
    path: '',
    component: VisualizacaoDinamicaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetadadosRoutingModule {}