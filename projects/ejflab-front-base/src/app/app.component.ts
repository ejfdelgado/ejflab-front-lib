import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EjflabFrontLibComponent } from 'ejflab-front-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EjflabFrontLibComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ejflab-front-base';
}
