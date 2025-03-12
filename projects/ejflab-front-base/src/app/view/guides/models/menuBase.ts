//import { BaseComponent } from "ejflab-front-lib";

import { BaseComponent } from "projects/ejflab-front-lib/src/public-api";

export interface MenuItemData {
  id: string;
  text: string;
  description: string;
  module: any;
}

export class BaseMenuItemClass extends BaseComponent {

  menuItem: MenuItemData | null = null;
  setMenuItem(menuItem: MenuItemData) {
    this.menuItem = menuItem;
  }

  override bindEvents() {

  }
}
