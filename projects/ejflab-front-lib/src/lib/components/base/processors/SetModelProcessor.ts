import { BaseProcesor } from './BaseProcesor';
import { ContextComponent } from '../context.component';

export class SetModelProcessor extends BaseProcesor {
  constructor(context: ContextComponent) {
    super(context);
  }
  async execute(args: any) {
    const { model } = args;
    //console.log(`SetModelProcessor ${JSON.stringify(model)}`);
    this.context.setModel(model);
  }
}
