import { ContextComponent } from '../context.component';
import { RTCCom } from '../RTCCom';
import { BaseProcesor } from './BaseProcesor';

export class RemoveUserProcessor extends BaseProcesor {
  constructor(context: ContextComponent) {
    super(context);
  }
  async execute(args: any) {
    const index = this.context.userList.indexOf(args.socketId);
    if (index >= 0) {
      this.context.userList.splice(index, 1);
      RTCCom.closeChannelWith(args.socketId);
      RTCCom.unregisterAudioVideoElement(args.socketId);
    }
  }
}
