import { Component, Input } from '@angular/core';
import { MenuItemData } from '../../models/menu';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css', '../../guides.component.css'],
})
export class DocumentationComponent {
  @Input() data: MenuItemData | null;
}
