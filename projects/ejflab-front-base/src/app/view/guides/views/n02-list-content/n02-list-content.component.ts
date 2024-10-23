import { Component } from '@angular/core';
import { MenuItemClass } from '../../models/menu';

@Component({
  selector: 'app-n02-list-content',
  standalone: false,
  templateUrl: './n02-list-content.component.html',
  styleUrls: ['./n02-list-content.component.css', '../../guides.component.css'],
})
export class N02ListContentComponent extends MenuItemClass {
  animal: any = {
    nombre: 'Elefante',
    patas: 1,
    mamifero: true,
    vuela: false,
    ubicaciones: [
      {
        latitud: 435245,
        longitud: 67657,
        nombre: 'Africa',
      },
      {
        latitud: 769879,
        longitud: 2345235,
        nombre: 'America',
      },
    ],
  };
}
