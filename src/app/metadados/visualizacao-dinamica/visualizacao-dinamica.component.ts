import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoNotificationService,
  PoPageAction,
  PoTableAction,
  PoTableColumn,
  PoDynamicFormField,
} from '@po-ui/ng-components';
import { MetadadosService } from '../metadados.service';

@Component({
  selector: 'app-visualizacao-dinamica',
  templateUrl: './visualizacao-dinamica.component.html',
  styleUrls: ['./visualizacao-dinamica.component.less'],
})
export class VisualizacaoDinamicaComponent implements OnInit {
  private _idProjeto!: string;

  public titulo: string = 'Formulário Dinâmico';
  public dados: Array<any> = [];
  public colunas: Array<PoTableColumn> = [];
  public carregando = false;
  public acoesTela: Array<PoPageAction> = [
    {
      label: 'Novo',
      action: this._navegarParaFormulario.bind(this),
    },
  ];

  public acoesTabela: Array<PoTableAction> = [
    {
      label: 'Editar',
      action: this._navegarParaFormulario.bind(this),
    },
    {
      label: 'Excluir',
      action: this._excluirRegistro.bind(this),
    },
  ];

  constructor(
    private _metadados: MetadadosService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _notification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this._carregarParametros();
    this._carregarSchema();
  }

  private _carregarLista() {
    if (!!this._idProjeto) {
      this.carregando = true;
      this._metadados.obterTodos(this._idProjeto).subscribe(
        (ret) => {
          this.dados = ret.items;
        },
        (error) => {
          console.error(error);
          this._notification.error(
            'Erro ao carregar lista dos registros do formulário.'
          );
        },
        () => (this.carregando = false)
      );
    }
  }

  private _carregarSchema() {
    if (!!this._idProjeto) {
      this.carregando = true;
      this.titulo = this._metadados.obterTituloMetadado(this._idProjeto);
      const onSuccess = (schema: Array<PoDynamicFormField>) => {
        this.colunas = schema.map((campo) => {
          return <PoTableColumn>{
            label: campo.label,
            type: campo.type,
            property: campo.property,
            visible: campo.visible,
            tooltip: campo.help,
            format: campo.format,
          };
        });
        this._carregarLista();
      };
      const onError = (error: any) => {
        console.error(error);
        this._notification.error(
          'Erro ao carregar lista dos registros do formulário.'
        );
        this.carregando = false;
      };

      this._metadados.obterSchema(this._idProjeto, onSuccess, onError);
    }
  }

  private _carregarParametros() {
    this._idProjeto = this._activatedRoute.snapshot.params.codProjeto;
  }

  private _navegarParaFormulario(registro?: any) {
    const baseUrl = `metadados/${this._idProjeto}/form`;
    if (!!registro && !!registro.id) {
      this._router.navigateByUrl(`${baseUrl}/${registro.id}`);
    } else {
      this._router.navigateByUrl(baseUrl);
    }
  }

  private _excluirRegistro(registro: any) {
    if (!!registro && !!registro.id) {
      this.carregando = true;
      this._metadados.deletar(registro.id, this._idProjeto).subscribe(
        () => {
          this._carregarLista();
          this._notification.success('Registro excluído com sucesso');
        },
        (error) => {
          this._notification.error('Erro ao excluir registro');
          console.error(error);
          this.carregando = false;
        }
      );
    }
  }
}
