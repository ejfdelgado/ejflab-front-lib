import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css', '../../guides.component.css'],
})
export class DocumentationComponent {
  @Input() title: string;
  @Input() description: string;
}
