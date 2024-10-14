import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemData } from './models/menu';
import { N01DynamicContentComponent } from './views/n01-dynamic-content/n01-dynamic-content.component';
import { N02ListContentComponent } from './views/n02-list-content/n02-list-content.component';
import { N03ModelComponent } from './views/n03-model/n03-model.component';

export const TheGuides: Array<MenuItemData> = [
  {
    id: 'app-n01-dynamic-content',
    text: 'Dynamic Content',
    description: '',
    module: N01DynamicContentComponent,
  },
  {
    id: 'app-n02-list-content',
    text: 'Dynamic List Content',
    description: '',
    module: N02ListContentComponent,
  },
  {
    id: 'app-n03-model',
    text: 'Model',
    description: '',
    module: N03ModelComponent,
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
