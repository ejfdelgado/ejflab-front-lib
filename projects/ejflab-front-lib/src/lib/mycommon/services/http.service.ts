import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpOptionsData } from '../interfaces/login-data.interface';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';
import { MyUtilities } from '@ejfdelgado/ejflab-common/src/MyUtilities';
import { IndicatorService, Wait } from './indicator.service';
import { AuthService } from '../services/auth.service';
import { Buffer } from 'buffer';
import { MyDatesFront } from '@ejfdelgado/ejflab-common/src/MyDatesFront';
import { FileSaveResponseData } from './fileInterface';
import { ModalErrorService } from './modalError.service';

const DEFAULT_PAGE_SIZE = 30;

const MAPEO_MIME_TIMES: { [key: string]: string } = {
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/jpeg': 'jpeg',
  'image/tiff': 'tiff',
  'image/png': 'png',
};

const EXTENSION_FALLBACK = 'jpg';

function checkMaxFileSize(myBlob: Blob, MAX_MB: number) {
  if (myBlob.size > 1024 * 1024 * MAX_MB) {
    throw new Error(`La imagen es muy grande, se espera menor a ${MAX_MB}MB`);
  }
}

export interface LoadFileData {
  folder?: string | null; // predeterminado es general
  fileName?: string | null; // overwrite the path and file name
  sizebig?: string | null; // 1024
  sizesmall?: string | null; //256
  foldertype?: string | null; //FIRST_YEAR_MONTH|FIRST_EMAIL|own
  isprivate?: string | null;
  isplainfile?: string | null;
  erasefile?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  static CACHE: { [key: string]: any } = {};
  constructor(
    private http: HttpClient,
    private indicatorSrv: IndicatorService,
    private modalSrv: ModalErrorService,
    private auth: AuthService,
  ) { }

  getServerTime() {
    return MyDatesFront.getServerTime();
  }

  async postWithFile(
    myFile: string,
    subUrl: string,
    extra: any = null,
    options?: HttpOptionsData,
    loadOptions?: LoadFileData
  ) {
    let wait: Wait | null = null;
    if (!options || options.showIndicator !== false) {
      wait = this.indicatorSrv.start();
    }
    try {
      const UPLOAD_URL = MyUtilities.removeRepeatedSlash(`${MyConstants.resolveDomain(subUrl)}${subUrl}`);
      const accessToken = await this.auth.getIdToken();
      const extraText = Buffer.from(JSON.stringify(extra)).toString('base64');
      let extension: string | null = null;
      const mimeParts = /data:([^;]+)/gi.exec(myFile);
      if (mimeParts != null) {
        extension = MAPEO_MIME_TIMES[mimeParts[1]];
      }
      if (!extension) {
        extension = EXTENSION_FALLBACK;
      }
      const blob = await this.b64toBlob(myFile);
      checkMaxFileSize(blob, MyConstants.BUCKET.MAX_MB);
      const promesa = new Promise<FileSaveResponseData>((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.open('POST', UPLOAD_URL, true);
        req.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        if (typeof loadOptions?.fileName == 'string') {
          req.setRequestHeader('filename', loadOptions.fileName);
        } else {
          req.setRequestHeader('filename', `miarchivo.${extension}`);
        }
        const HEADERS_PASS = [
          'folder',
          'sizebig',
          'sizesmall',
          'foldertype',
          'isplainfile',
          'isprivate',
          'erasefile',
        ];
        if (loadOptions) {
          const temp: any = loadOptions;
          for (let i = 0; i < HEADERS_PASS.length; i++) {
            const header = HEADERS_PASS[i];
            if (typeof temp[header] == 'string' || temp[header] != null) {
              req.setRequestHeader(header, temp[header]);
            }
          }
        }
        req.setRequestHeader('extra', extraText);
        req.onload = (event) => {
          const jsonResponse = JSON.parse(req.responseText);
          const status = req.status;
          if (status >= 400 && status <= 599) {
            reject(jsonResponse);
          } else {
            resolve(jsonResponse);
          }
        };
        req.onerror = (e: ProgressEvent) => {
          reject({ message: 'Error guardando archivo' });
        };
        req.send(blob);
      });
      promesa.finally(() => {
        if (wait != null) {
          wait.done();
        }
      });
      return promesa;
    } catch (err) {
      if (wait != null) {
        wait.done();
      }
      throw err;
    }
  }

  async getAll<Type>(
    path: string,
    options?: HttpOptionsData
  ): Promise<Array<Type>> {
    const params = {
      max: options?.pageSize ? options?.pageSize : DEFAULT_PAGE_SIZE,
      offset: 0,
    };
    let total: Array<Type> = [];
    let actual: any | null;
    let prefijo = '?';
    let added: number = 0;
    if (path.indexOf('?') >= 0) {
      prefijo = '&';
    }
    let myUrl = `${MyConstants.resolveDomain(path)}/${path}`;
    myUrl = MyUtilities.removeRepeatedSlash(myUrl);
    do {
      actual = await this.get<any | null>(
        `${myUrl}${prefijo}offset=${params.offset}&max=${params.max}`,
        options
      );
      if (actual != null) {
        let arreglo = actual;
        if (typeof options?.key == 'string') {
          const partes = options?.key?.split('.');
          for (let i = 0; i < partes.length; i++) {
            const parte = partes[i];
            arreglo = arreglo[parte];
            if ([null, undefined].indexOf(arreglo) >= 0) {
              throw new Error(
                `La ruta ${options?.key} no se encontró en la respuesta.`
              );
            }
          }
        }
        if (arreglo instanceof Array) {
          added = arreglo.length;
          for (let i = 0; i < added; i++) {
            total.push(arreglo[i]);
          }
          params.offset += added;
        }
      }
    } while (actual != null && added > 0);
    return total;
  }

  async get<Type>(
    path: string,
    options?: HttpOptionsData
  ): Promise<Type | null> {
    let wait = null;
    if (!options || options.showIndicator !== false) {
      wait = this.indicatorSrv.start();
    }
    let myUrl = `${MyConstants.resolveDomain(path)}/${path}`;
    myUrl = MyUtilities.removeRepeatedSlash(myUrl);
    let cacheKey: string | null = null;
    if (options?.useCache === true) {
      cacheKey = myUrl; // TODO include POST payload MD5
    }
    try {
      let first: Observable<any> = of(null);

      if (options?.useCache === true && cacheKey != null) {
        if (cacheKey in HttpService.CACHE) {
          const cached: any = HttpService.CACHE[cacheKey];
          if (options?.isBlob === true) {
            return Promise.resolve(cached);
          } else {
            return Promise.resolve(JSON.parse(JSON.stringify(cached)));
          }
        }
      }
      if (options?.isBlob === true) {
        first = this.http.get(myUrl, {
          responseType: 'blob',
        });
      } else if (options?.rawString === true) {
        first = this.http.get(myUrl, {
          responseType: 'text',
        });
      } else {
        first = this.http.get<Type>(myUrl);
      }

      const respuesta = await new Promise<Type | null>((resolve, reject) => {
        first
          .pipe(
            catchError((error) => {
              if (!options || options.showError !== false) {
                if (error.error) {
                  this.modalSrv.error(error.error);
                } else {
                  this.modalSrv.error(error);
                }
              }
              reject(error);
              return of(null);
            })
          )
          .subscribe((data) => {
            if (options?.useCache === true && cacheKey != null) {
              HttpService.CACHE[cacheKey] = data;
            }
            resolve(data);
          });
      });
      return respuesta;
    } catch (err) {
      throw err;
    } finally {
      if (wait != null) {
        wait.done();
      }
    }
  }
  async post<Type>(
    path: string,
    payload: any,
    options?: HttpOptionsData
  ): Promise<Type | null> {
    return this.generic(path, payload, options, 'post');
  }

  async put<Type>(
    path: string,
    payload: any,
    options?: HttpOptionsData
  ): Promise<Type | null> {
    return this.generic(path, payload, options, 'put');
  }

  async generic<Type>(
    path: string,
    payload: any,
    options?: HttpOptionsData,
    method: string = 'post'
  ): Promise<Type | null> {
    let wait = null;
    if (!options || options.showIndicator !== false) {
      wait = this.indicatorSrv.start();
    }
    const headers: { [key: string]: string } = {
      'x-avoid-token': 'no',
    };
    if (options?.avoidToken === true) {
      headers['x-avoid-token'] = 'yes';
    }
    if (options?.contentType) {
      headers['Content-Type'] = options?.contentType;
    }
    try {
      const respuesta = await new Promise<Type | null>((resolve, reject) => {
        let basicRequest;
        if (method == 'post') {
          basicRequest = this.http.post<Type>(
            MyUtilities.removeRepeatedSlash(`${MyConstants.resolveDomain(path)}${path}`),
            payload,
            {
              headers: headers,
            }
          );
        } else if (method == 'put') {
          basicRequest = this.http.put<Type>(
            MyUtilities.removeRepeatedSlash(`${MyConstants.resolveDomain(path)}${path}`),
            payload,
            {
              headers: headers,
            }
          );
        } else {
          throw new Error(`Method ${method} does not exists`);
        }

        basicRequest
          .pipe(
            catchError((error) => {
              if (!options || options.showError !== false) {
                if (error.error) {
                  this.modalSrv.error(error.error);
                } else {
                  this.modalSrv.error(error);
                }
              }
              reject(error);
              return of(null);
            })
          )
          .subscribe((data) => {
            resolve(data);
          });
      });
      return respuesta;
    } catch (err) {
      throw err;
    } finally {
      if (wait != null) {
        wait.done();
      }
    }
  }
  async delete<Type>(
    path: string,
    options?: HttpOptionsData
  ): Promise<Type | null> {
    let wait = null;
    if (!options || options.showIndicator !== false) {
      wait = this.indicatorSrv.start();
    }
    try {
      const respuesta = await new Promise<Type | null>((resolve, reject) => {
        this.http
          .delete<Type>(MyUtilities.removeRepeatedSlash(`${MyConstants.resolveDomain(path)}${path}`), {})
          .pipe(
            catchError((error) => {
              if (!options || options.showError !== false) {
                if (error.error) {
                  this.modalSrv.error(error.error);
                } else {
                  this.modalSrv.error(error);
                }
              }
              reject(error);
              return of(null);
            })
          )
          .subscribe((data: any) => {
            resolve(data);
          });
      });
      return respuesta;
    } catch (err) {
      throw err;
    } finally {
      if (wait != null) {
        wait.done();
      }
    }
  }

  async b64toBlob(b64Data: string) {
    const base64Response = await fetch(b64Data);
    const blob = await base64Response.blob();
    return blob;
  }
}
