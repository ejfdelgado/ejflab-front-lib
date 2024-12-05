import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  IndicatorPayload,
  IndicatorService,
} from '../../services/indicator.service';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';
import { MyUtilities } from '@ejfdelgado/ejflab-common/src/MyUtilities';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.css'],
  standalone: false,
})
export class IndicatorComponent implements OnInit {
  isLoading: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private indicatorSrv: IndicatorService
  ) {}

  ngOnInit(): void {
    const actualizarEstadoThis = this.actualizarEstado.bind(this);
    this.indicatorSrv.subscribe(actualizarEstadoThis);
  }

  private actualizarEstado(payload: IndicatorPayload) {
    this.isLoading = payload.loading;
    this.cdr.detectChanges();
  }

  getIconImage() {
    return MyUtilities.removeRepeatedSlash(
      MyConstants.SRV_ROOT + '/assets/img/loading2.gif'
    );
  }
}
