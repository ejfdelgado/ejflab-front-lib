import { Component } from '@angular/core';
import { MenuItemClass } from '../../models/menu';
import { IndicatorService } from 'ejflab-front-lib';

@Component({
  selector: 'app-n08-activity',
  templateUrl: './n08-activity.component.html',
  styleUrls: ['./n08-activity.component.css', '../../guides.component.css'],
})
export class N08ActivityComponent extends MenuItemClass {
  constructor(private indicatorSrv: IndicatorService) {
    super();
  }

  async sleep(millis: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, millis);
    });
  }

  async makeSomeBackEnCall() {
    const promise = this.indicatorSrv.start();
    await this.sleep(5000);
    promise.done();
  }
}
