import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';
import { WebcamModule } from 'ngx-webcam';
// Material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSliderModule } from '@angular/material/slider';
// Components
import { CardComponent } from './components/card/card.component';
import { ImagepickerComponent } from './components/imagepicker/imagepicker.component';
import { StatusbarComponent } from './components/statusbar/statusbar.component';
import { TxtfileeditorComponent } from './components/txtfileeditor/txtfileeditor.component';
import { BlobeditorComponent } from './components/blobeditor/blobeditor.component';
import { FileordevicepopupComponent } from './components/fileordevicepopup/fileordevicepopup.component';
import { FilepickerComponent } from './components/filepicker/filepicker.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CanvaseditorComponent } from './components/canvaseditor/canvaseditor.component';
import { ScrollnavComponent } from './components/scrollnav/scrollnav.component';
import { ScrollfilesComponent } from './components/scrollfiles/scrollfiles.component';
import { PrejsonComponent } from './components/prejson/prejson.component';
import { ScrollfileComponent } from './components/scrollfile/scrollfile.component';
import { AdduserrolepopupComponent } from './components/adduserrolepopup/adduserrolepopup.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthorizationpopupComponent } from './components/authorizationpopup/authorizationpopup.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { GenericComponent } from './components/generic/generic.component';
import { IndicatorComponent } from './components/indicator/indicator.component';
import { LoginpopupComponent } from './components/loginpopup/loginpopup.component';
import { MultiplepagesComponent } from './components/multiplepages/multiplepages.component';
import { PagepopupComponent } from './components/pagepopup/pagepopup.component';
import { PayupopupComponent } from './components/payupopup/payupopup.component';
import { UserpopupComponent } from './components/userpopup/userpopup.component';
import { WebcamComponent } from './components/webcam/webcam.component';
// Pipes
import { FechaCardPipe } from './pipes/fecha-card.pipe';
import { SortByNamePipe } from './pipes/sort-by-name.pipe';
import { JsonColorPipe } from './pipes/json-color.pipe';
import { Json2svg } from './pipes/json2svg.pipe';
import { Epoch2datePipe } from './pipes/epoch2date.pipe';
import { TranslatePipe } from './pipes/translate.pipe';
import { InterpolatePipe } from './pipes/interpolate.pipe';
// Directives
import { NgInit } from './directives/NgInit';
import { MMDDYYYYAdapter } from './adapters/date-adapters';
import { SincePipe } from './pipes/since.pipe';
import { AgePipe } from './pipes/age.pipe';

@NgModule({
  declarations: [
    // Components
    CardComponent,
    ImagepickerComponent,
    StatusbarComponent,
    TxtfileeditorComponent,
    BlobeditorComponent,
    FilepickerComponent,
    FileordevicepopupComponent,
    CanvaseditorComponent,
    ScrollnavComponent,
    ScrollfilesComponent,
    PrejsonComponent,
    AdduserrolepopupComponent,
    AlertComponent,
    AuthorizationpopupComponent,
    ConfirmComponent,
    GenericComponent,
    IndicatorComponent,
    LoginpopupComponent,
    MultiplepagesComponent,
    PagepopupComponent,
    PayupopupComponent,
    UserpopupComponent,
    WebcamComponent,
    ScrollfileComponent,
    // Pipes
    SortByNamePipe,
    JsonColorPipe,
    FechaCardPipe,
    Epoch2datePipe,
    TranslatePipe,
    Json2svg,
    InterpolatePipe,
    SincePipe,
    AgePipe,
    // Directives
    NgInit,
    // Adapters
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContenteditableValueAccessorModule,
    WebcamModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressBarModule,
    MatSliderModule,
  ],
  exports: [
    // Components
    CardComponent,
    ImagepickerComponent,
    StatusbarComponent,
    TxtfileeditorComponent,
    BlobeditorComponent,
    FilepickerComponent,
    FileordevicepopupComponent,
    CanvaseditorComponent,
    ScrollnavComponent,
    ScrollfilesComponent,
    PrejsonComponent,
    AdduserrolepopupComponent,
    AlertComponent,
    AuthorizationpopupComponent,
    ConfirmComponent,
    GenericComponent,
    IndicatorComponent,
    LoginpopupComponent,
    MultiplepagesComponent,
    PagepopupComponent,
    PayupopupComponent,
    UserpopupComponent,
    WebcamComponent,
    ScrollfileComponent,
    // Pipes
    SortByNamePipe,
    JsonColorPipe,
    FechaCardPipe,
    Epoch2datePipe,
    TranslatePipe,
    Json2svg,
    InterpolatePipe,
    SincePipe,
    // Directives
    NgInit,
  ],
  providers: [
    SortByNamePipe,
    JsonColorPipe,
    FechaCardPipe,
    Epoch2datePipe,
    TranslatePipe,
    Json2svg,
    InterpolatePipe,
    SincePipe,
  ],
})
export class MycommonModule { }
