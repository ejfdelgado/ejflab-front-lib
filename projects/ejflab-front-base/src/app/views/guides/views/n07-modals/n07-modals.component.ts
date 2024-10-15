import { Component } from '@angular/core';
import { ModalService } from 'projects/ejflab-front-lib/src/lib/services/modal.service';
import { MenuItemClass } from '../../models/menu';

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
    this.model.confirm = await this.modalSrv.confirm({
      txt: 'Sure?',
      title: 'Confirm title',
    });
  }
}
