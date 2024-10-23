import { Component, OnInit } from '@angular/core';
import { MenuItemClass } from '../../models/menu';
import { TranslateService } from 'ejflab-front-lib';

@Component({
  selector: 'app-n06-pipes',
  templateUrl: './n06-pipes.component.html',
  styleUrls: ['./n06-pipes.component.css', '../../guides.component.css'],
})
export class N06PipesComponent extends MenuItemClass implements OnInit {
  model: any = {
    epoch: new Date().getTime(),
  };
  constructor(private translateSrv: TranslateService) {
    super();
  }
  async ngOnInit(): Promise<void> {
    this.model.text = await this.translateSrv.translate('say_bye', ['test']);
  }
}
