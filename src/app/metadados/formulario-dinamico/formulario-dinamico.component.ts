import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoDynamicFormField } from '@po-ui/ng-components';
import { MetadadosService } from '../metadados.service';

@Component({
  selector: 'app-formulario-dinamico',
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.less'],
})
export class FormularioDinamicoComponent implements OnInit {
  private _idProjeto!: string;
  private _idRegistro!: string;

  public title: string = '';
  public model: any;
  public layout: Array<PoDynamicFormField> = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _metadados: MetadadosService
  ) {}

  ngOnInit(): void {
    this._getParams();
  }

  public validar(formulario: any) {
    console.log(formulario);
  }

  private _getParams() {
    this._idProjeto = this._activatedRoute.snapshot.params.codProjeto;
    this._idRegistro = this._activatedRoute.snapshot.params.id;
  }

  private _getSchema() {
    const onSuccess = (schema: Array<PoDynamicFormField>) => {
      this.layout = schema;
    };
    const onError = (error: any) => {};

    this._metadados.obterSchema(this._idProjeto, onSuccess, onError);
    // this.title = this._metadados.obterTituloMetadado(this._idProjeto);
  }
}
