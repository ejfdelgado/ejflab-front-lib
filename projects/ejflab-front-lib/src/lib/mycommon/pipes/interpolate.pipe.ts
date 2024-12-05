import { Pipe, PipeTransform } from '@angular/core';
import { MyTemplate } from '@ejfdelgado/ejflab-common/src/MyTemplate';

@Pipe({
  name: 'interpolate',
  standalone: false,
})
export class InterpolatePipe implements PipeTransform {
  static renderer = new MyTemplate();
  constructor() {}
  transform(value: string, ...args: unknown[]): string {
    return InterpolatePipe.renderer.render(value, args[0]);
  }
}
