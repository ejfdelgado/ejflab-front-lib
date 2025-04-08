import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent, AlertData } from '../components/alert/alert.component';
import {
  ConfirmComponent,
  ConfirmData,
} from '../components/confirm/confirm.component';
import {
  GenericComponent,
  GenericData,
} from '../components/generic/generic.component';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  TRANSLATION: any = {
    'en': {
      "yes": "Yes",
      "no": "No",
      "ok": "Ok",
      "ups": "Oops!",
    },
    'es': {
      "yes": "Sí",
      "no": "No",
      "ok": "Ok",
      "ups": "Ups!",
    },
  }
  constructor(
    public dialog: MatDialog,
    private configService: ConfigService,
  ) { }

  translate(key: string) {
    let lang = this.configService.getCurrentLanguage();
    if (!(lang in this.TRANSLATION)) {
      lang = 'es';
    }
    return this.TRANSLATION[lang][key];
  }

  async alert(payload: AlertData) {
    const homologation: GenericData = {
      txt: payload.txt,
      ishtml: payload.ishtml,
      title: payload.title,
      translateFolder: payload.translateFolder,
      model: payload.model,
      choices: [
        {
          txt: this.translate('ok'),
          val: '0'
        }
      ],
    };
    return this.generic(homologation);
  }

  async error(error: Error) {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: {
        title: this.translate('ups'),
        txt: error.message,
        buttons: [
          { label: this.translate('ok') }
        ]
      },
    });
    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }

  async confirm(payload: ConfirmData): Promise<boolean | null> {
    const homologation: GenericData = {
      txt: payload.txt,
      title: payload.title,
      translateFolder: payload.translateFolder,
      imageUrl: payload.imageUrl,
      model: payload.model,
      choices: [
        { txt: this.translate('no'), val: '0', icon: "close", class: "btn-secondary" },
        { txt: this.translate('yes'), val: '1', icon: "check" },
      ],
    };
    const choice: any = await this.generic(homologation);
    if (choice) {
      if (choice.choice === '1') {
        return true;
      } else if (choice.choice === '0') {
        return false;
      } else {
        return null;
      }
    } else {
      // Case when close window
      return null;
    }
  }

  async generic(payload: GenericData) {
    const dialogRef = this.dialog.open(GenericComponent, {
      data: payload,
      disableClose: true, //Force pick a choice
    });
    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }
  genericComplete(payload: GenericData) {
    const dialogRef = this.dialog.open(GenericComponent, {
      data: payload,
      disableClose: true, //Force pick a choice
    });
    return {
      ref: dialogRef,
      promise: new Promise((resolve) => {
        dialogRef.afterClosed().subscribe((result) => {
          resolve(result);
        });
      }),
    };
  }
}
