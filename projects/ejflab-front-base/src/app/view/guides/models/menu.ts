export interface MenuItemData {
  id: string;
  text: string;
  description: string;
  module: any;
}

export class MenuItemClass {
  menuItem: MenuItemData | null = null;
  setMenuItem(menuItem: MenuItemData) {
    this.menuItem = menuItem;
  }
}
