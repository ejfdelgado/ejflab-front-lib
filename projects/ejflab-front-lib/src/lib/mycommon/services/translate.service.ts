import { Injectable } from '@angular/core';
import { SimpleObj } from '@ejfdelgado/ejflab-common/src/SimpleObj';
import { HttpService } from './http.service';
import { MyTemplate } from '@ejfdelgado/ejflab-common/src/MyTemplate';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  COOKIE_NAME = 'noglang';
  keyPromises: any = {};
  renderer: any;
  constructor(private httpService: HttpService) {
    this.renderer = new MyTemplate();
  }

  setLanguage(lang: string) {
    this.setCookie(this.COOKIE_NAME, lang, 1000);
    window.location.reload();
  }

  setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  getCookie(cname: string) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  getCurrentLanguage() {
    let currentLang = 'en';
    const urlParams = new URLSearchParams(window.location.search);
    const queryParamLanguage = urlParams.get('l');
    if (queryParamLanguage) {
      currentLang = queryParamLanguage;
      this.setCookie(this.COOKIE_NAME, currentLang, 1000);
    } else {
      currentLang = this.getCookie(this.COOKIE_NAME) || 'en';
    }
    return currentLang;
  }

  async loadLanguageDB(args: unknown[]) {
    // Read query param
    const currentLang = this.getCurrentLanguage();
    const key = `${args[0]}/${currentLang}`;
    let promesa = this.keyPromises[key];
    if (!promesa) {
      this.keyPromises[key] = this.httpService.get(`assets/lang/${key}.json`);
      promesa = this.keyPromises[key];
    }
    const valor = await promesa;
    return valor;
  }

  async translate(key: string, args: unknown[]) {
    const def: any = key;
    if (args.length > 0) {
      let valor: any = {};
      const args0: any = args[0];
      if (typeof args0 == 'string') {
        valor = await this.loadLanguageDB(args);
      } else if (
        args0 !== undefined &&
        args0 !== null &&
        typeof args0 == 'object'
      ) {
        const currentLang = this.getCurrentLanguage();
        if (currentLang in args0) {
          valor = args0[currentLang];
        }
      }
      let raw = SimpleObj.getValue(valor, key, def);
      if (args.length >= 2) {
        raw = this.renderer.render(raw, args[1]);
      }
      return raw;
    } else {
      return def;
    }
  }
}
