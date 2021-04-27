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
            .map((p) => new Formulario(p.id, p.description, p.apiRoute));
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
              f.validate = `${this._http.config.apiUrl}${this._frameworkApiUrl}/${f.validate}`;
            }

            if (!!f.searchService) {
              f.searchService = `${this._http.config.apiUrl}${this._frameworkApiUrl}/${f.searchService}`;
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

  public obterTodos(
    projeto: string,
  ): Observable<any> {

    const uri = `framework/v1/metadata/data/${projeto}`;
    return this._http.get(uri);
  }

  // public obterTituloMetadado(projeto: string) {
  //   for (const iterator of context.user.permissions) {
  //     const customizacao = iterator.children.find((c) =>
  //       c.apiRoute.includes(projeto)
  //     );

  //     if (!!customizacao) {
  //       return customizacao.description;
  //     }
  //   }

  //   return '';
  // }
}
