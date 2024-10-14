import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItemClass } from '../../models/menu';

@Component({
  selector: 'app-n04-reactive-forms',
  templateUrl: './n04-reactive-forms.component.html',
  styleUrls: [
    './n04-reactive-forms.component.css',
    '../../guides.component.css',
  ],
})
export class N04ReactiveFormsComponent extends MenuItemClass {
  myOpinionForm = new FormGroup({
    comment: new FormControl(''),
    visibility: new FormControl('public'),
    reviewed: new FormControl(false),
    summary: new FormControl(''),
  });

  constructor() {
    super();
  }
}
