import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponentData } from 'src/interfaces/login-data.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  host: { class: 'box' },
})
export class CardComponent implements OnInit {
  @HostBinding('class.small') isSmall: boolean = false;
  @HostBinding('class.big') isBig: boolean = false;
  @HostBinding('class.big1') isBig1: boolean = false;
  @HostBinding('class.big2') isBig2: boolean = false;
  @HostBinding('class.big3') isBig3: boolean = false;
  @Input() data: CardComponentData;
  icons: { [key: string]: string } = {
    game: 'sports_esports',
  };

  constructor(private readonly router: Router) {}
  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    if (changes.data) {
      const bigColumn = changes.data.currentValue.bigColumn;
      this.isSmall = false;
      this.isBig = false;
      this.isBig1 = false;
      this.isBig2 = false;
      this.isBig3 = false;
      switch (bigColumn) {
        case 0:
          this.isSmall = true;
          break;
        case 1:
          this.isBig = true;
          this.isBig1 = true;
          break;
        case 2:
          this.isBig = true;
          this.isBig2 = true;
          break;
        case 3:
          this.isBig = true;
          this.isBig3 = true;
          break;
      }
    }
  }

  getIcon(icon: string | undefined | null): string {
    if (typeof icon == 'string') {
      return this.icons[icon];
    }
    return 'sports_esports';
  }

  navegar(data: CardComponentData) {
    if (typeof data.action == 'function') {
      data.action(data);
    } else if (typeof data.href == 'string') {
      this.router.navigate([data.href]);
    }
  }
}
