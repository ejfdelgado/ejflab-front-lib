import { ContextComponent } from '../context.component';
import { BaseProcesor } from './BaseProcesor';

export class UpdateUserListProcessor extends BaseProcesor {
  constructor(context: ContextComponent) {
    super(context);
  }
  async execute(args: any) {
    if (this.context.userList instanceof Array) {
      this.context.userList.splice(0, this.context.userList.length);
    }
    this.context.userList.push(...args.socketIds);
    this.context.cdr.detectChanges();
    requestAnimationFrame(() => {
      //console.log(JSON.stringify(this.context.userList, null, 4));
      this.context.registerVideoElements();
      this.context.registerAudioElements();
    });
  }
}
