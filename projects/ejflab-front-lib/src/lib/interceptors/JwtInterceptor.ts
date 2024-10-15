import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MicrosoftAuthService } from '../services/microsoftAuth.service';

const URLS_NO_TOKEN = ['https://storage.googleapis.com'];

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private msAuth: MicrosoftAuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const avoidToken: any = request.headers.get('x-avoid-token');
    let promesaToken: Promise<string | null> = Promise.resolve(null);
    if (['yes', 'ms'].indexOf(avoidToken) < 0) {
      promesaToken = this.auth.getIdToken();
    } else if (avoidToken == 'ms') {
      promesaToken = this.msAuth.getSessionToken();
    }
    return from(promesaToken).pipe(
      switchMap((token) => {
        if (token == null) {
          const headers = request.headers.append('HTTP_REFERER', location.href);
          const requestClone = request.clone({
            headers,
          });
          return next.handle(requestClone);
        } else {
          const url = request.url;
          const partes = /^(https?:\/\/[^\/]+)/.exec(url);
          let addAuthorization = true;
          if (partes != null) {
            const dominio = partes[1];
            if (URLS_NO_TOKEN.indexOf(dominio) >= 0) {
              addAuthorization = false;
            }
          }

          let headers = request.headers
            .append('X-Referer', location.href)
            .append('X-Host', location.origin);

          if (addAuthorization) {
            headers = headers.append('Authorization', 'Bearer ' + token);
          }

          const requestClone = request.clone({
            headers,
          });

          return next.handle(requestClone);
        }
      })
    );
  }
}
