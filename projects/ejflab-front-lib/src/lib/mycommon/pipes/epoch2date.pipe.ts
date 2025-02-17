import { Pipe, PipeTransform } from '@angular/core';
import { MyDatesFront } from '@ejfdelgado/ejflab-common/src/MyDatesFront';

// https://www.npmjs.com/package/dateformat

// <td>{{ variable | epoch2date:'mmm d yyyy' }}</td>

@Pipe({
  name: 'epoch2date',
})
export class Epoch2datePipe implements PipeTransform {
  transform(value: number | undefined, ...args: unknown[]): unknown {
    if (typeof value == 'number') {
      return MyDatesFront.formatDateCompleto(new Date(value), ...args);
    }
    return null;
  }
}
