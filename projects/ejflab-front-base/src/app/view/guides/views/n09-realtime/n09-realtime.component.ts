import { Component } from '@angular/core';
import { BaseMenuItemClass } from '../../models/menuBase';

@Component({
  selector: 'app-n09-realtime',
  templateUrl: './n09-realtime.component.html',
  styleUrl: './n09-realtime.component.css'
})
export class N09RealtimeComponent extends BaseMenuItemClass {
  override onTupleReadDone() {
    super.onTupleReadDone();
  }

  override onTupleNews() {
    //console.log(this.tupleModel);
    super.onTupleNews();
  }

  async setTime() {
    if (!this.tupleModel) {
      return;
    }
    this.tupleModel.t = new Date().getTime();
    super.saveTuple();
  }
}
