import { Component } from '@angular/core';
import { MenuItemClass } from '../../models/menu';
import { ModalService, TranslateService } from 'ejflab-front-lib';

@Component({
  selector: 'app-n07-modals',
  templateUrl: './n07-modals.component.html',
  styleUrls: ['./n07-modals.component.css', '../../guides.component.css'],
})
export class N07ModalsComponent extends MenuItemClass {
  model: any = {
    confirm: null,
    generic: null,
  };
  constructor(
    private modalSrv: ModalService,
    private translateSrv: TranslateService
  ) {
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

  async openCustom() {
    console.log(`The system open the pop up`);

    const modalResponse: any = await this.modalSrv.generic({
      translateFolder: 'test',
      title: 'popups.custom.title',
      txt: 'popups.custom.text',
      choices: [
        { txt: 'popups.choices.yes_word', val: '1' },
        { txt: 'popups.choices.no_word', val: '2' },
      ],
    });
    this.model.generic = modalResponse?.choice;
    console.log(`The user choose ${this.model.generic}`);
  }
}
