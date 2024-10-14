import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItemClass } from '../../models/menu';

@Component({
  selector: 'app-n04-reactive-forms',
  templateUrl: './n04-reactive-forms.component.html',
  styleUrls: [
    './n04-reactive-forms.component.css',
    '../../guides.component.css',
    '../n03-model/n03-model.component.css',
  ],
})
export class N04ReactiveFormsComponent extends MenuItemClass implements OnInit {
  model: any = {};
  myOpinionForm: FormGroup;

  ngOnInit(): void {
    // Create the form
    this.myOpinionForm = new FormGroup({
      comment: new FormControl(''),
      visibility: new FormControl('public'),
      reviewed: new FormControl(false),
      summary: new FormControl(''),
    });

    // bind the event
    this.myOpinionForm.get('summary')?.valueChanges.subscribe((event: any) => {
      this.model.characters = event.length;
    });
  }
}
