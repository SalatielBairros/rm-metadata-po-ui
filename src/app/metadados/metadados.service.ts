import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../core/base-http.service';
import { Formulario } from './formulario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MetadadosService {
  constructor(private _http: BaseHttpService) {}

  public obterListaFormularios(): Observable<Formulario[]> {
    return this._http
      .get<Formulario>('hcg/v1/pep/practitioners/UserData/')
      .pipe(
        map((usuario: any) => {
          console.log(
            (<Array<any>>usuario.permissions[1].children)
              .filter((p) => p.isMetadata == true)
              .map((p) => new Formulario(p.id, p.description, p.apiRoute))
          );

          return (<Array<any>>usuario.permissions[1].children)
            .filter((p) => p.isMetadata == true)
            .map((p) => new Formulario(p.id, p.description, p.apiRoute));
        })
      );
  }
}
