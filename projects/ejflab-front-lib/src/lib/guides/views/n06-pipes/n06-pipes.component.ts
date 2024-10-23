import { Component, OnInit } from '@angular/core';
import { MenuItemClass } from '../../models/menu';

@Component({
  selector: 'app-n06-pipes',
  templateUrl: './n06-pipes.component.html',
  styleUrls: ['./n06-pipes.component.css', '../../guides.component.css'],
})
export class N06PipesComponent extends MenuItemClass implements OnInit {
  model: any = {
    epoch: new Date().getTime(),
  };
  ngOnInit(): void {
    //
  }
}
