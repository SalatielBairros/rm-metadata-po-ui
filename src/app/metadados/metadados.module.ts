import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioDinamicoComponent } from './formulario-dinamico/formulario-dinamico.component';
import { VisualizacaoDinamicaComponent } from './visualizacao-dinamica/visualizacao-dinamica.component';
import { PoModule } from '@po-ui/ng-components';
import { MetadadosRoutingModule } from './metadados-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptorService } from '../core/http-request-interceptor.service';

@NgModule({
  declarations: [FormularioDinamicoComponent, VisualizacaoDinamicaComponent],
  imports: [CommonModule, MetadadosRoutingModule, PoModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptorService,
      multi: true,
    },
  ],
})
export class MetadadosModule {}
