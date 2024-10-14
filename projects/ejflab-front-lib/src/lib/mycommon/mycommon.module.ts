import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Epoch2datePipe } from './pipes/epoch2date.pipe';

@NgModule({
  declarations: [Epoch2datePipe],
  imports: [CommonModule],
  exports: [Epoch2datePipe],
})
export class MycommonModule {}
