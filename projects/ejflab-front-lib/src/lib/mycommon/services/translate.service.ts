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

  async loadLanguageDB(args: unknown[]) {
    // Read query param
    const urlParams = new URLSearchParams(window.location.search);
    const queryParamLanguage = urlParams.get('l');
    let currentLang = 'en';
    if (queryParamLanguage) {
      currentLang = queryParamLanguage;
      this.setCookie(this.COOKIE_NAME, currentLang, 1000);
    } else {
      currentLang = this.getCookie(this.COOKIE_NAME) || 'en';
    }

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
    const valor = await this.loadLanguageDB(args);
    const def: any = key;
    let raw = SimpleObj.getValue(valor, key, def);
    if (args.length >= 2) {
      raw = this.renderer.render(raw, args[1]);
    }
    return raw;
  }
}
