import { Inject, Injectable } from '@angular/core';
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
import { jwtDecode } from "jwt-decode";

const URLS_NO_TOKEN = ['https://storage.googleapis.com'];

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private msAuth: MicrosoftAuthService,
    @Inject('authProvider') private authProvider: string,
  ) { }

  isTokenExpired(token: string, minutes: number = 0) {
    const response: any = {
      with: true,
      without: true,
      correct: false,
    };
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.exp) {
        const expirationTime = decodedToken.exp * 1000;
        const now = Date.now();
        response.with = now > (expirationTime - minutes * 60 * 1000);
        response.without = now > expirationTime;
        response.correct = true;
      }
    } catch (err) {
      //
    }
    return response;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const avoidToken: any = request.headers.get('x-avoid-token');
    let promesaToken: Promise<string | null> = Promise.resolve(null);
    if (avoidToken != "yes") {
      if (this.authProvider == "microsoft") {
        promesaToken = this.msAuth.getSessionToken("id");
      } else if (this.authProvider == "google") {
        promesaToken = this.auth.getIdToken();
      }
    }

    return from(promesaToken).pipe(
      switchMap((token) => {
        //console.log(`auth ${request.url} ${token ? token.substring(0, 10) : "null"}`);
        if (token == null) {
          const headers = request.headers.append('HTTP_REFERER', location.href);
          const requestClone = request.clone({
            headers,
          });
          return next.handle(requestClone);
        } else {
          // could check if it is expired...
          const expired = this.isTokenExpired(token, 30);
          if (expired) {
            if (expired.without === true) {
              // Nothing to do, it is expired at all
              if (this.authProvider == "microsoft") {
                /*
                this.msAuth.logoutSimple().then(()=> {
                  if (expired.correct) {
                    window.location.reload();
                  }
                });
                */
              }
            } else if (expired.with === true && expired.correct) {
              // Could refresh it
              if (this.authProvider == "microsoft") {
                console.log("Refresing token");
                this.msAuth.refreshActiveAccount();
              }
            }
          }
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
