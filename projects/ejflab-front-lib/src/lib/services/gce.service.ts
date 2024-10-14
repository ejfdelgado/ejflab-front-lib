import { Injectable } from '@angular/core';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';
import { HttpService } from './http.service';
import { IndicatorService } from './indicator.service';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class GceService {
  constructor(
    private httpService: HttpService,
    private indicatorSrv: IndicatorService,
    private modalSrv: ModalService
  ) {}
  async readAll(): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/jobs/readall`,
      {},
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer los servidores');
    }
    return response;
  }

  async iterateGce(name: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/jobs/iterate`,
      {
        name,
      },
      {
        showIndicator: false,
      }
    );
    if (response == null) {
      throw Error('No se pudo avanzar la ejecución');
    }
    return response;
  }

  async readCurrentState(name: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/instances/state`,
      {
        name,
      },
      {
        showIndicator: false,
      }
    );
    if (response == null) {
      throw Error('No se pudo leer el estado');
    }
    return response;
  }
}
