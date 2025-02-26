import { Inject, Injectable, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../components/alert/alert.component';

export abstract class ErrorManager {
  abstract errorToMessage(error: Error): Promise<{ title: string, txt: string }>;
}

export class ErrorManagerDefault extends ErrorManager {
  override async errorToMessage(error: Error): Promise<{ title: string; txt: string; }> {
    return { title: "Oops!", txt: error.message };
  }
}

@Injectable({
  providedIn: 'root',
})
export class ModalErrorService {
  defaultErrorManager = new ErrorManagerDefault();
  constructor(
    public dialog: MatDialog,
    @Optional() @Inject('errorManager') private errorManager: ErrorManager,
  ) { }

  async error(error: Error) {

    let message = {};
    if (this.errorManager) {
      // Provided
      message = await this.errorManager.errorToMessage(error);
    } else {
      // Default
      message = await this.defaultErrorManager.errorToMessage(error);
    }
    const dialogRef = this.dialog.open(AlertComponent, {
      data: message,
    });
    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => {
        resolve(result);
      });
    });
  }
}
