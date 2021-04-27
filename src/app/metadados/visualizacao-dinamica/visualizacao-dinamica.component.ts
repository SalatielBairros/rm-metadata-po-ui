import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetadadosService } from '../metadados.service';

@Component({
  selector: 'app-visualizacao-dinamica',
  templateUrl: './visualizacao-dinamica.component.html',
  styleUrls: ['./visualizacao-dinamica.component.less'],
})
export class VisualizacaoDinamicaComponent implements OnInit {
  private _idProjeto!: string;
  private dados: any;

  constructor(
    private _metadados: MetadadosService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._carregarParametros();
    this._carregarList();
  }

  private _carregarList() {
    this._metadados.obterTodos(this._idProjeto).subscribe((ret) => {
      this.dados = ret;
      console.log(ret);
    });
  }

  private _carregarParametros() {
    this._idProjeto = this._activatedRoute.snapshot.params.codProjeto;
  }
}
