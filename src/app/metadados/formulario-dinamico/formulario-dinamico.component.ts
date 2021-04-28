import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoDynamicFormField, PoPageAction } from '@po-ui/ng-components';
import { MetadadosService } from '../metadados.service';

@Component({
  selector: 'app-formulario-dinamico',
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.less'],
})
export class FormularioDinamicoComponent implements OnInit {
  private _idProjeto!: string;
  private _idRegistro!: string;

  public title: string = 'Formulário Dinâmico';
  public model: any = {};
  public layout: Array<PoDynamicFormField> = [];
  public acoesTela: Array<PoPageAction> = [
    {
      label: 'Salvar',
      action: this._salvarRegistro.bind(this),
    },
  ];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _metadados: MetadadosService
  ) {}

  ngOnInit(): void {
    this._getParams();
    this._getSchema();
    this._carregar()
  }

  // public validar(formulario: any): boolean {
  //   console.log(formulario);
  //   return true;
  // }

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

  private _carregar() {
    if (!!this._idRegistro && !!this._idProjeto) {
      this._metadados
        .obter(this._idRegistro, this._idProjeto)
        .subscribe((ret) => {
          this.model = ret;
        });
    }
  }

  private _salvarRegistro() {
    console.log(this.model);
    this._metadados.salvar(this._idRegistro, this.model, this._idProjeto)
      .subscribe();
  }
}
