import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from './config.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  public config: AppConfig;
  private _httpOptions = {
    headers: new HttpHeaders(),
  };

  constructor(
    private _http: HttpClient,
    private _configService: ConfigService
  ) {
    this.config = _configService.get();
    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.config.userToken}`,
      }),
    };
  }

  public get<T>(route: string): Observable<T> {
    const url = `${this.config.apiUrl}/${route}`;
    return this._http.get<T>(url, this._httpOptions);
  }

  public post<T>(route: string, model: T): Observable<T>{
    const url = `${this.config.apiUrl}/${route}`;
    return this._http.post<T>(url, model, this._httpOptions);
  }

  public put<T>(route: string, chave:string, model: T): Observable<T>{
    const url = `${this.config.apiUrl}/${route}/${chave}`;
    return this._http.put<T>(url, model, this._httpOptions);
  }

  public delete(route: string, chave:string): Observable<any>{
    const url = `${this.config.apiUrl}/${route}/${chave}`;
    return this._http.delete(url, this._httpOptions);
  }
}
