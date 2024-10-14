import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Epoch2datePipe } from './pipes/epoch2date.pipe';
import { FechaCardPipe } from './pipes/fecha-card.pipe';
import { JsonColorPipe } from './pipes/json-color.pipe';

@NgModule({
  declarations: [Epoch2datePipe, FechaCardPipe, JsonColorPipe],
  imports: [CommonModule],
  exports: [Epoch2datePipe, FechaCardPipe, JsonColorPipe],
})
export class MycommonModule {}
