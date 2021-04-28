import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../core/base-http.service';
import { Formulario } from './formulario.model';
import { map } from 'rxjs/operators';
import { PoDynamicFormField } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root',
})
export class MetadadosService {
  private _schemas: { [projeto: string]: Array<PoDynamicFormField> } = {};
  private _menus: { [projeto: string]: Formulario } = {};
  private _frameworkApiUrl = 'framework/v1';
  private _schemaApi = this._frameworkApiUrl + '/metadata/schema/form';

  constructor(private _http: BaseHttpService) {}

  public obterListaFormularios(): Observable<Formulario[]> {
    return this._http
      .get<Formulario>('hcg/v1/pep/practitioners/UserData/')
      .pipe(
        map((usuario: any) => {
          return (<Array<any>>usuario.permissions[1].children)
            .filter((p) => p.isMetadata == true)
            .map((p) => {
              const formulario = new Formulario(
                p.id,
                p.description,
                p.apiRoute
              );
              this._menus[formulario.apiRoute] = formulario;
              return formulario;
            });
        })
      );
  }

  public obterSchema(
    projeto: string,
    callback: (fields: Array<PoDynamicFormField>) => void,
    error?: (ex: any) => void
  ): void {
    if (!!this._schemas[projeto] && this._schemas[projeto].length) {
      callback(this._schemas[projeto]);
      return;
    }

    this._http
      .get<Array<PoDynamicFormField>>(`${this._schemaApi}/${projeto}`)
      .pipe(
        map((fields) =>
          fields.map((f) => {
            if (!!f.options && !!f.options.length && f.type === 'number') {
              f.type = 'string';
            }

            if (!!f.validate) {
              f.validate = `${this._http.config.apiUrl}/${this._frameworkApiUrl}/${f.validate}`;
            }

            if (!!f.searchService) {
              f.searchService = `${this._http.config.apiUrl}/${this._frameworkApiUrl}/${f.searchService}`;
            }

            if (!!f.booleanTrue && !!f.booleanFalse) {
              f.type = 'boolean';
            }

            return f;
          })
        )
      )
      .subscribe(
        (x) => {
          this._schemas[projeto] = { ...x };
          callback(x);
        },
        (ex) => {
          if (!!error) {
            error(ex);
          }
        }
      );
  }

  public obterTodos(projeto: string): Observable<any> {
    const uri = `framework/v1/metadata/data/${projeto}`;
    return this._http.get(uri);
  }

  public obter(chavePrivaria: string, projeto: string): Observable<any> {
    return this._http.get(
      `framework/v1/metadata/data/${projeto}/${chavePrivaria}`
    );
  }

  public salvar(
    chavePrimaria: string,
    dado: any,
    projeto: string
  ): Observable<any> {
    if (!!chavePrimaria && !!chavePrimaria.length) {
      return this._atualizar(chavePrimaria, dado, projeto);
    } else {
      return this._criar(dado, projeto);
    }
  }

  public chamarFormulaVisualValidacaoCampo(
    url_workflow: string,
    dados: any
  ): Observable<any> {
    return this._http.postByUrl(url_workflow, dados);
  }

  private _criar(dado: any, projeto: string): Observable<any> {
    return this._http.post(`framework/v1/metadata/data/${projeto}`, dado);
  }

  private _atualizar(chavePrivaria: string, dado: any, projeto: string) {
    return this._http.put(
      `framework/v1/metadata/data/${projeto}`,
      chavePrivaria,
      dado
    );
  }

  public deletar(chavePrimaria: string, projeto: string): Observable<any> {
    return this._http.delete(
      `framework/v1/metadata/data/${projeto}`,
      chavePrimaria
    );
  }

  public obterTituloMetadado(projeto: string) {
    if (!!this._menus[projeto]) {
      return this._menus[projeto].description;
    }

    return 'Formulário Dinâmico';
  }
}
