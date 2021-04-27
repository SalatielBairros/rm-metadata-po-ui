import { Component, OnInit } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';
import { MetadadosService } from './metadados/metadados.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public menus: Array<PoMenuItem> = [];

  constructor(private metadataSerivce: MetadadosService) {}

  public ngOnInit() {
    this.metadataSerivce.obterListaFormularios().subscribe((formularios) => {
      this.menus = formularios.map(
        (f) =>
          <PoMenuItem>{
            label: f.description,
          }
      );
    });
  }
}
