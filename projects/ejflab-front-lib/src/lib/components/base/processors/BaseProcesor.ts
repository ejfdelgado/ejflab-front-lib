import { ContextComponent } from '../context.component';

export abstract class BaseProcesor {
  context: ContextComponent;
  constructor(context: ContextComponent) {
    this.context = context;
  }
  abstract execute(args: any): void;
}
