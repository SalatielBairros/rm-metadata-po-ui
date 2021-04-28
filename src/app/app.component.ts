import { Component, OnInit } from '@angular/core';

import { PoMenuItem, PoNotificationService } from '@po-ui/ng-components';
import { MetadadosService } from './metadados/metadados.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public menus: Array<PoMenuItem> = [
    <PoMenuItem>{
      label: 'Home',
      link: '/',
    },
  ];

  constructor(
    private _metadataSerivce: MetadadosService,
    private _notification: PoNotificationService
  ) {}

  public ngOnInit() {
    this._metadataSerivce.obterListaFormularios().subscribe(
      (formularios) => {
        this.menus = [
          <PoMenuItem>{
            label: 'Home',
            link: '/',
          },
        ];

        const menusFormularios = formularios.map(
          (f) =>
            <PoMenuItem>{
              label: f.description,
              link: `/metadados/${f.apiRoute}`,
            }
        );

        this.menus.push(...menusFormularios);
      },
      (error) => {
        console.log(error);
        this._notification.error(
          'Erro ao carregar menus do usuario para metadados.'
        );
      }
    );
  }
}
