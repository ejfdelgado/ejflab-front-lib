import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';

@Pipe({
  name: 'since'
})
export class SincePipe implements PipeTransform {
  constructor(private translateSrv: TranslateService) { }
  transform(valueOriginal: any, ...args: unknown[]): Promise<unknown> {
    return new Promise(async (resolve, reject) => {
      if (typeof valueOriginal == 'number') {
        const actual = new Date().getTime();
        const value = actual - valueOriginal;
        const map: any = {
          'original': valueOriginal,
          'actual': actual,
          'seconds': 0,
          'minutes': 0,
          'hours': 0,
          'type': 'seconds',
        };
        map['seconds'] = Math.ceil(value / 1000);
        if (map['seconds'] > 60) {
          map['minutes'] = Math.ceil(map['seconds'] / 60);
          map['type'] = 'minutes';
        }
        if (map['minutes'] > 60) {
          map['hours'] = Math.ceil(map['minutes'] / 60);
          map['type'] = 'hours';
        }
        let translateFolder: any = 'nogales';
        if (args && args.length > 0) {
          translateFolder = args[0];
        }
        const rendered = await this.translateSrv.translate(`since.${map['type']}`, [translateFolder, map]);
        resolve(rendered);
      } else {
        resolve('-');
      }
    });
  }
}
