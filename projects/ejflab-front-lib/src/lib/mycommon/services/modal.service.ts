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

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(public dialog: MatDialog) {}

  async alert(payload: AlertData) {
    const homologation: GenericData = {
      txt: payload.txt,
      title: payload.title,
      translateFolder: payload.translateFolder,
      model: payload.model,
      choices: [{ txt: 'Ok', val: '0' }],
    };
    return this.generic(homologation);
  }

  async error(error: Error) {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { title: 'Ups!', txt: error.message },
    });
    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }

  async confirm(payload: ConfirmData) {
    const homologation: GenericData = {
      txt: payload.txt,
      title: payload.title,
      translateFolder: payload.translateFolder,
      model: payload.model,
      choices: [
        { txt: 'Ok', val: '1' },
        { txt: 'No', val: '0' },
      ],
    };
    const choice: any = await this.generic(homologation);
    if (choice.choice === '1') {
      return true;
    } else if (choice.choice === '0') {
      return true;
    } else {
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
