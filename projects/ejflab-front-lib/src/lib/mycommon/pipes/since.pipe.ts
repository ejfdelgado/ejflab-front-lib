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
        const signedValue = actual - valueOriginal;
        const value = Math.abs(signedValue);
        const map: any = {
          'original': valueOriginal,
          'actual': actual,
          'seconds': 0,
          'minutes': 0,
          'hours': 0,
          'type': 'seconds',
        };
        map['seconds'] = Math.floor(value / 1000);
        if (map['seconds'] > 60) {
          map['minutes'] = Math.floor(map['seconds'] / 60);
          map['seconds'] = map['seconds'] % 60;
          map['type'] = 'minutes';
        }
        if (map['minutes'] > 60) {
          map['hours'] = Math.floor(map['minutes'] / 60);
          map['minutes'] = map['minutes'] % 60;
          map['type'] = 'hours';
        }
        let translateFolder: any = 'nogales';
        if (args && args.length > 0) {
          translateFolder = args[0];
        }
        if (args && args.length > 1 && typeof args[1] == "string") {
          map['type'] = args[1];
        }
        map["hours2"] = (map["hours"]/100).toFixed(2).split(".")[1];
        map["minutes2"] = (map["minutes"]/100).toFixed(2).split(".")[1];
        map["seconds2"] = (map["seconds"]/100).toFixed(2).split(".")[1];
        const rendered = await this.translateSrv.translate(`since.${map['type']}`, [translateFolder, map]);
        resolve(rendered);
      } else {
        resolve('-');
      }
    });
  }
}
