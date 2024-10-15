import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Epoch2datePipe } from './pipes/epoch2date.pipe';
import { FechaCardPipe } from './pipes/fecha-card.pipe';
import { JsonColorPipe } from './pipes/json-color.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from './components/alert/alert.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { GenericComponent } from './components/generic/generic.component';
import { SortByNamePipe } from './pipes/sort-by-name.pipe';
import { NgInit } from './directives/NgInit';

@NgModule({
  declarations: [
    Epoch2datePipe,
    FechaCardPipe,
    JsonColorPipe,
    TranslatePipe,
    AlertComponent,
    ConfirmComponent,
    GenericComponent,
    SortByNamePipe,
    NgInit,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
  ],
  exports: [
    Epoch2datePipe,
    FechaCardPipe,
    JsonColorPipe,
    TranslatePipe,
    AlertComponent,
    ConfirmComponent,
    GenericComponent,
    SortByNamePipe,
    NgInit,
  ],
})
export class MycommonModule {}
