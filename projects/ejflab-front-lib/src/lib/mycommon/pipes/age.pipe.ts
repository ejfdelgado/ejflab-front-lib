import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../services/translate.service';
import { MyDatesFront } from '@ejfdelgado/ejflab-common/src/MyDatesFront';

@Pipe({
  name: 'age',
  standalone: false
})
export class AgePipe implements PipeTransform {
  constructor(private translateSrv: TranslateService) { }
  transform(value: unknown, ...args: unknown[]): Promise<unknown> {
    let level = typeof (args[1]) == "number" ? args[1] : 0;
    if ([0, 1, 2].indexOf(level) < 0) {
      level = 0;
    }
    return new Promise(async (resolve, reject) => {
      const model = MyDatesFront.age(value);
      if (model) {
        const rendered = await this.translateSrv.translate(`pipes.age.${level}`, [args[0], model]);
        resolve(rendered);
      } else {
        resolve(null);
      }
    });
  }
}
