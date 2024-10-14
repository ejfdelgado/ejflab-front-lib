import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from 'src/services/translate.service';

@Pipe({
  name: 'translate',
})
export class TranslatePipe implements PipeTransform {
  constructor(private translateSrv: TranslateService) {}
  transform(value: string, ...args: unknown[]): Promise<unknown> {
    return this.translateSrv.translate(value, args);
  }
}
