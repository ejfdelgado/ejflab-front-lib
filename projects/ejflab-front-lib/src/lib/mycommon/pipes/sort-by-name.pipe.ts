import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByName',
})
export class SortByNamePipe implements PipeTransform {
  transform(value: any[], arg1?: any, arg2?: any): any[] {
    if (value instanceof Array) {
      const attr = arg1 ? arg1 : 'name';
      const ord = arg2 ? arg2 : 'asc';
      if (ord == 'asc') {
        return value.sort((a, b) => {
          return ('' + a.value[attr]).localeCompare(b.value[attr]);
        });
      } else {
        return value.sort((a, b) => {
          return ('' + b.value[attr]).localeCompare(a.value[attr]);
        });
      }
    } else {
      return [];
    }
  }
}
