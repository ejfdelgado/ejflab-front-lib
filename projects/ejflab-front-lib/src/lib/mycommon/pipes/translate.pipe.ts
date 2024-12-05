import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { MyTemplate } from '@ejfdelgado/ejflab-common/src/MyTemplate';

@Pipe({
  name: 'translate',
  standalone: false,
})
export class TranslatePipe implements PipeTransform {
  static renderer = new MyTemplate();
  constructor(private translateSrv: TranslateService) {}
  transform(value: string, ...args: unknown[]): Promise<unknown> {
    if (args[1]) {
      return new Promise(async (resolve, reject) => {
        try {
          let rendered = await this.translateSrv.translate(value, args);
          rendered = TranslatePipe.renderer.render(rendered, args[1]);
          resolve(rendered);
        } catch (err) {
          reject(err);
        }
      });
    } else {
      return this.translateSrv.translate(value, args);
    }
  }
}
