import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemData } from './models/menu';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css',
})
export class GuidesComponent {
  menu: Array<MenuItemData> = [
    { id: 'app-n01-dynamic-content', text: 'Dynamic Content' },
    { id: 'app-n02-list-content', text: 'Dynamic List Content' },
  ];
  currentMenuChoice: MenuItemData | null = null;
  constructor(private router: Router) {}
  goTo(id: string) {
    console.log(`goto ${id}`);
    this.router.navigate(['guides', id]);
    this.currentMenuChoice = this.menu.filter((item) => {
      item.id == id;
    })[0];
  }
  componentAdded(event: any) {
    event.setMenuItem(this.currentMenuChoice);
  }
  componentRemoved(event: any) {}
}
