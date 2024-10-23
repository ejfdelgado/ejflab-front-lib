import { Component } from '@angular/core';
import { MenuItemClass } from '../../models/menu';
import { ModalService } from 'projects/ejflab-front-lib/src/public-api';

@Component({
  selector: 'app-n07-modals',
  templateUrl: './n07-modals.component.html',
  styleUrls: ['./n07-modals.component.css', '../../guides.component.css'],
})
export class N07ModalsComponent extends MenuItemClass {
  model: any = {
    confirm: null,
  };
  constructor(private modalSrv: ModalService) {
    super();
  }

  openAlert() {
    this.modalSrv.alert({ title: 'Title', txt: 'This is my content' });
  }

  async openConfirm() {
    console.log(`The system open the pop up`);
    this.model.confirm = await this.modalSrv.confirm({
      txt: 'Sure?',
      title: 'Confirm title',
    });
    console.log(`The user choose ${this.model.confirm}`);
  }
}
