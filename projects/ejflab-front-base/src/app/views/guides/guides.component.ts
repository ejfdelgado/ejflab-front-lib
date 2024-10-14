import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemData } from './models/menu';
import { N01DynamicContentComponent } from './views/n01-dynamic-content/n01-dynamic-content.component';
import { N02ListContentComponent } from './views/n02-list-content/n02-list-content.component';
import { N03ModelComponent } from './views/n03-model/n03-model.component';
import { N04ReactiveFormsComponent } from './views/n04-reactive-forms/n04-reactive-forms.component';
import { N05FormValidationComponent } from './views/n05-form-validation/n05-form-validation.component';

export const TheGuides: Array<MenuItemData> = [
  {
    id: 'app-n01-dynamic-content',
    text: 'Dynamic Content',
    description: 'Show mapping from JSON to html',
    module: N01DynamicContentComponent,
  },
  {
    id: 'app-n02-list-content',
    text: 'ngFor',
    description: 'Let show array items',
    module: N02ListContentComponent,
  },
  {
    id: 'app-n03-ngmodel',
    text: 'ngModel',
    description: 'Capture input data',
    module: N03ModelComponent,
  },
  {
    id: 'app-n04-reactive-forms',
    text: 'Forms without ngModel',
    description: 'Handle complex forms',
    module: N04ReactiveFormsComponent,
  },
  {
    id: 'app-n05-form-validation',
    text: 'Forms with validations',
    description: 'Add validation to inputs',
    module: N05FormValidationComponent,
  },
];

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css',
})
export class GuidesComponent {
  menu: Array<MenuItemData> = TheGuides;
  currentMenuChoice: MenuItemData | null = null;
  constructor(private router: Router) {}
  goTo(id: string) {
    this.router.navigate(['guides', id]);
    this.currentMenuChoice = this.menu.filter((item) => {
      return item.id == id;
    })[0];
  }
  componentAdded(event: any) {
    event.setMenuItem(this.currentMenuChoice);
  }
  componentRemoved(event: any) {}
}
