import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioDinamicoComponent } from './formulario-dinamico/formulario-dinamico.component';
import { VisualizacaoDinamicaComponent } from './visualizacao-dinamica/visualizacao-dinamica.component';
import { PoModule } from '@po-ui/ng-components';
import { MetadadosRoutingModule } from './metadados-routing.module';

@NgModule({
  declarations: [FormularioDinamicoComponent, VisualizacaoDinamicaComponent],
  imports: [CommonModule, MetadadosRoutingModule, PoModule],
})
export class MetadadosModule {}
