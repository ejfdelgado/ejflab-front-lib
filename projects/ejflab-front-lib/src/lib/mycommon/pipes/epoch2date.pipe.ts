import { Pipe, PipeTransform } from '@angular/core';
import { MyDatesFront } from '@ejfdelgado/ejflab-common/src/MyDatesFront';

@Pipe({
  name: 'epoch2date',
  standalone: false,
})
export class Epoch2datePipe implements PipeTransform {
  transform(value: number | undefined, ...args: unknown[]): unknown {
    if (typeof value == 'number') {
      return MyDatesFront.formatDateCompleto(new Date(value), args);
    }
    return null;
  }
}
