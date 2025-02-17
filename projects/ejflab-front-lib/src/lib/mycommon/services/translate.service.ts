import { Injectable } from '@angular/core';
import { SimpleObj } from '@ejfdelgado/ejflab-common/src/SimpleObj';
import { HttpService } from './http.service';
import { MyTemplate } from '@ejfdelgado/ejflab-common/src/MyTemplate';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  COOKIE_NAME = 'noglang';
  keyPromises: any = {};// this is the cache
  renderer: any;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.renderer = new MyTemplate();
  }

  setLanguage(lang: string) {
    this.configService.setLanguage(lang);
  }

  async loadLanguageDB(args: unknown[]) {
    // Read query param
    const currentLang = this.configService.getCurrentLanguage();
    const key = `${args[0]}/${currentLang}`;
    let promesa = this.keyPromises[key];
    if (!promesa) {
      this.keyPromises[key] = this.httpService.get(`assets/lang/${key}.json`);
      promesa = this.keyPromises[key];
    }
    const valor = await promesa;
    return valor;
  }

  /**
   * 
   * @param key 
   * @param args Can be a string, referencing the folder name in assets/lang/FOLDER/en.json or a JSON object {es: {}, en: {}}
   * @returns 
   */
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
        const currentLang = this.configService.getCurrentLanguage();
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
