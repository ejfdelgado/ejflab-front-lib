import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

export interface MailSendData {
  template: string;
  params: any;
  to: Array<string>;
  subject: string;
  replyTo: string;
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
