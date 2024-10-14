import { Component } from '@angular/core';
import { MenuItemClass } from '../../models/menu';

@Component({
  selector: 'app-n03-model',
  templateUrl: './n03-model.component.html',
  styleUrls: ['./n03-model.component.css', '../../guides.component.css'],
})
export class N03ModelComponent extends MenuItemClass {
  model: any = {};

  constructor() {
    super();
  }

  summaryChanged(event: string) {
    this.model.characters = event.length;
  }
}
