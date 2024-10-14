import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
  myOpinionForm = this.formBuilder.group({
    comment: '',
    visibility: 'public',
    reviewed: false,
    summary: '',
  });

  constructor(private formBuilder: FormBuilder) {
    super();
  }
}
