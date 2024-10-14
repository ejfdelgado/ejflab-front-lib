import { BaseProcesor } from './BaseProcesor';
import { ContextComponent } from '../context.component';

export class EchoLogProcessor extends BaseProcesor {
  MAX_ELEMENTS = 10;
  constructor(context: ContextComponent) {
    super(context);
  }
  async execute(args: any) {
    this.context.log.unshift(args.message);
    if (this.context.log.length > this.MAX_ELEMENTS) {
      this.context.log.splice(
        this.MAX_ELEMENTS,
        this.context.log.length - this.MAX_ELEMENTS
      );
    }
    this.context.log = [...this.context.log];
  }
}
