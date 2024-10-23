import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItemClass } from '../../models/menu';

@Component({
  selector: 'app-n05-form-validation',
  templateUrl: './n05-form-validation.component.html',
  styleUrls: [
    './n05-form-validation.component.css',
    '../../guides.component.css',
    '../n03-model/n03-model.component.css',
  ],
})
export class N05FormValidationComponent
  extends MenuItemClass
  implements OnInit
{
  myOpinionForm: FormGroup;

  ngOnInit(): void {
    // Create the form
    this.myOpinionForm = new FormGroup({
      comment: new FormControl('', [Validators.required]),
      visibility: new FormControl('public'),
      reviewed: new FormControl(false),
      summary: new FormControl(''),
    });
  }

  sendData() {
    if (!this.myOpinionForm.valid) {
      alert('Verify the form');
      return;
    }
  }
}
