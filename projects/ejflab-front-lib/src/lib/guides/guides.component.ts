import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItemData } from './models/menu';
import { TheGuides } from './models/menu-index';

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
