import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LocalFileJson } from './localfilejson';
import { MycommonModule } from '../mycommon.module';

@Injectable({
  providedIn: 'root',
})
export class LocalTupleService extends LocalFileJson {
  constructor(public override httpSrv: HttpService) {
    super(httpSrv);
    this.FILE_NAME = 'localtuple.json';
  }
}
