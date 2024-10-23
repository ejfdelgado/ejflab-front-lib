import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class ModalErrorService {
  constructor(public dialog: MatDialog) {}

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
}
