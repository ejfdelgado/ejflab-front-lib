import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItemClass } from '../../models/menu';
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function MyCustomValidator(lista: Array<number>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valor = control.value;

    const indice = lista.indexOf(valor);
    //console.log("El indice es "+indice);
    
    if (indice == -1) {
      // Caso que esta mal
      return {
        'no_esta_en_la_lista': true
      };
    }

    // Todo bien
    return {};
  };
}

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
      comment: new FormControl(null, [MyCustomValidator([50, 30])]),
      visibility: new FormControl(null, [Validators.required]),
      reviewed: new FormControl(null, [Validators.required]),
      summary: new FormControl(null, [Validators.required]),
    });
  }

  sendData() {
    if (!this.myOpinionForm.valid) {
      alert('Verify the form');
      return;
    }
  }
}
