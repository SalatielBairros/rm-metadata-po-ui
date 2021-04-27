import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioDinamicoComponent } from './formulario-dinamico/formulario-dinamico.component';
import { VisualizacaoDinamicaComponent } from './visualizacao-dinamica/visualizacao-dinamica.component';
import { PoModule } from '@po-ui/ng-components';



@NgModule({
  declarations: [
    FormularioDinamicoComponent,
    VisualizacaoDinamicaComponent
  ],
  imports: [
    CommonModule,
    PoModule
  ]
})
export class MetadadosModule { }
