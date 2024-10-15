import { ChangesData, ContextComponent } from '../context.component';
import { BaseProcesor } from './BaseProcesor';

export class ReceiveLiveChangesProcessor extends BaseProcesor {
  constructor(context: ContextComponent) {
    super(context);
  }
  async execute(changes: ChangesData) {
    if (changes.orig !== this.context.socketId) {
      this.context.livemodel = this.context.builder.affect(changes);
    }
  }
}
