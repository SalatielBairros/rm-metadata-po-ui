import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigService } from "./config.service";

@Injectable()
export class HttpRequestInterceptorService implements HttpInterceptor{
  constructor(private config: ConfigService){

  }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = this._hasAuthorization(req);
    return next.handle(req)
  }

  private _hasAuthorization(req: HttpRequest<any>) {
    if (!req.headers.has('Authorization')) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Basic ' + this.config.get().userToken,
        },
      });
    }
    return req;
  }
}