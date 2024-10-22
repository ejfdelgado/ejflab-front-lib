import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MycommonModule } from '../mycommon.module';

export interface MailSendData {
  template: string;
  params: any;
  to: Array<string>;
  subject: string;
}

@Injectable({
  providedIn: 'root',
})
export class MailService {
  constructor(private httpService: HttpService) {}

  async send(data: MailSendData) {
    await this.httpService.post(
      'srv/email/send',
      { body: data },
      {
        showIndicator: true,
      }
    );
  }
}
