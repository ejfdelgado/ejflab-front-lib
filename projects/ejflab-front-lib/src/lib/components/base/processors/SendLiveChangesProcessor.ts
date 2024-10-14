import { ChangesData, ContextComponent } from '../context.component';
import { BaseProcesor } from './BaseProcesor';

export class SendLiveChangesProcessor extends BaseProcesor {
  constructor(context: ContextComponent) {
    super(context);
  }
  async execute(changes: ChangesData) {
    const instance = this.context.getCallServiceInstance();
    changes.orig = instance.getSocketId();
    instance.emitEvent('clientChange', {
      changes,
    });
  }
}
