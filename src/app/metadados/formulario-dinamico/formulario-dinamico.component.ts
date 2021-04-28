import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoNotificationService,
  PoPageAction,
} from '@po-ui/ng-components';
import { MetadadosService } from '../metadados.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-formulario-dinamico',
  templateUrl: './formulario-dinamico.component.html',
  styleUrls: ['./formulario-dinamico.component.less'],
})
export class FormularioDinamicoComponent implements OnInit {
  private _idProjeto!: string;
  private _idRegistro!: string;
  private _errosFormulasVisuais: { [projeto: string]: string } = {};

  public loading = false;
  public titulo: string = 'Formulário Dinâmico';
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
    private _metadados: MetadadosService,
    private _notification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this._getParams();
    this._getSchema();
  }

  public validarCampos() {
    const camposInvalidos = this._buscarCamposInvalidos();
    const possuiCamposInvalidos = camposInvalidos?.length > 0;

    if (possuiCamposInvalidos) {
      const campos = camposInvalidos.map((x) => x.label).join(', ');
      this._notification.warning(`Campos inválidos: ${campos}`);
      return false;
    }

    if (Object.keys(this._errosFormulasVisuais).length > 0) {
      this._notification.warning(
        'Registro será salvo com ressalvas: erro nas validações das fórmulas visuais.'
      );
    }

    return true;
  }

  private _getParams() {
    this._idProjeto = this._activatedRoute.snapshot.params.codProjeto;
    this._idRegistro = this._activatedRoute.snapshot.params.id;
  }

  private _getSchema() {
    const onSuccess = (schema: Array<PoDynamicFormField>) => {
      schema
        .filter((field) => !!field.validate)
        .forEach((field) => {
          const url = <string>field.validate;
          field.validate = (changeValue: PoDynamicFormFieldChanged) => {
            const sucesso = (data: any) => {
              this.model = data;

              this._removerMensagemCampo(changeValue);

              this.loading = false;
            };

            const erro = (error: any) => {
              console.error(error);
              this._notification.error(
                'Validação via fórmula visual retornou erro.'
              );
              this._adicionarMensagemNoCampo(error, changeValue);

              this.loading = false;
            };

            this.loading = true;

            this._metadados
              .chamarFormulaVisualValidacaoCampo(url, this.model)
              .subscribe(sucesso, erro);

            return {};
          };
        });

      this.layout = schema;
      this._carregar();
    };

    const onError = (error: any) => {
      this._notification.error('Erro ao carregar layout do formulário.');
      console.error(error);
      this.loading = false;
    };

    this._metadados.obterSchema(this._idProjeto, onSuccess, onError);
    this.titulo = this._metadados.obterTituloMetadado(this._idProjeto);
  }

  private _carregar() {
    if (!!this._idRegistro && !!this._idProjeto) {
      this._metadados.obter(this._idRegistro, this._idProjeto).subscribe(
        (ret) => {
          this.model = ret;
          this._atualizarCamposData();
          this._atualizarSeletoresTipoNumerico();
        },
        (erro) => {
          console.error(erro);
          this._notification.error('Erro ao carregar registro.');
        },
        () => (this.loading = false)
      );
    } else {
      this.loading = false;
    }
  }

  private _salvarRegistro() {
    this.loading = true;
    this._metadados
      .salvar(this._idRegistro, this.model, this._idProjeto)
      .subscribe(
        (ret) => {
          this._notification.success('Registro salvo com sucesso.');
        },
        (error) => {
          this._notification.error('Erro ao salvar registro.');
          console.error(error);
        },
        () => (this.loading = false)
      );
  }

  private _removerMensagemCampo(changeValue: PoDynamicFormFieldChanged) {
    const element = document.querySelector(
      `[ng-reflect-name="${changeValue.property}"]`
    );

    if (!!element) {
      element.classList.remove('ng-dirty');
      element.classList.remove('ng-invalid');
      element
        .querySelectorAll('.fd-field-validation')
        .forEach((e) => e.parentNode?.removeChild(e));

      delete this._errosFormulasVisuais[changeValue.property];
    }
  }

  private _adicionarMensagemNoCampo(
    error: any,
    changeValue: PoDynamicFormFieldChanged
  ) {
    let errorMessage = 'Erro ao executar a validação';
    if (!!error && !!error.error && !!error.error.DetailMessage) {
      errorMessage = error.error.DetailMessage;
    }
    const element = document.querySelector(
      `[ng-reflect-name="${changeValue.property}"]`
    );

    if (!!element) {
      element.classList.add('ng-dirty');
      element.classList.add('ng-invalid');

      if (element.querySelectorAll('.fd-field-validation').length === 0) {
        const descricaoErro = `<span title="${errorMessage}" p-tooltip-position="right" class="po-icon po-icon-info danger-color fd-field-validation"></span>`;

        const title = element.querySelector('.po-field-container-title');
        if (!!title) {
          title.innerHTML += descricaoErro;
        }
        this._errosFormulasVisuais[changeValue.property] = errorMessage;
      }
    }
  }

  private _buscarCamposInvalidos() {
    return this.layout.filter((x) => {
      const estaVazio =
        !this.model[x.property] || _.isEmpty(this.model[x.property].toString());

      return x.required && estaVazio && x.visible && !x.disabled;
    });
  }

  private _atualizarCamposData() {
    this.layout
      .filter(
        (x) =>
          x.type === 'dateTime' &&
          !!this.model[x.property]
      )
      .map((x) => x.property)
      .forEach((x) => (this.model[x] = new Date(this.model[x])));
  }

  private _atualizarSeletoresTipoNumerico() {
    this.layout
      .filter(
        (x) =>
          (x.type === 'number' || x.type === 'string') &&
          !!this.model[x.property] &&
          !!x.options &&
          !!x.options.length
      )
      .map((x) => x.property)
      .forEach((x) => (this.model[x] = this.model[x].toString()));
  }
}
