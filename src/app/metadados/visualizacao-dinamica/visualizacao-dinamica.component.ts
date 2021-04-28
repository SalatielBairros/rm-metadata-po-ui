import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoPageAction, PoTableAction } from '@po-ui/ng-components';
import { MetadadosService } from '../metadados.service';

@Component({
  selector: 'app-visualizacao-dinamica',
  templateUrl: './visualizacao-dinamica.component.html',
  styleUrls: ['./visualizacao-dinamica.component.less'],
})
export class VisualizacaoDinamicaComponent implements OnInit {
  private _idProjeto!: string;
  public dados: Array<any> = [];
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
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._carregarParametros();
    this._carregarList();
  }

  private _carregarList() {
    if (!!this._idProjeto) {
      this._metadados.obterTodos(this._idProjeto).subscribe((ret) => {
        this.dados = ret.items;
      });
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
      this._metadados.deletar(registro.id, this._idProjeto).subscribe(() => {
        this._carregarList();
      });
    }
  }
}
