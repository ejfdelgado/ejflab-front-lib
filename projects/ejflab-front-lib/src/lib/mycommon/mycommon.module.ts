import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContenteditableValueAccessorModule } from '@tinkoff/angular-contenteditable-accessor';
import { MatSliderModule } from '@angular/material/slider';
import { WebcamModule } from 'ngx-webcam';
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
// Directives
import { NgInit } from './directives/NgInit';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './services/auth.service';
import { AuthorizationService } from './services/authorization.service';
import { BackendPageService } from './services/backendPage.service';
import { CallService } from './services/call.service';
import { DictateService } from './services/dictate-service';
import { FileService } from './services/file.service';
import { FlowchartService } from './services/flowchart.service';
import { GceService } from './services/gce.service';
import { HttpService } from './services/http.service';
import { ImagedetectionService } from './services/imagedetection.service';
import { ImageiationService } from './services/imagiation.service';
import { IndicatorService } from './services/indicator.service';
import { LocalFileService } from './services/localfile.service';
import { LocalPageService } from './services/localpage.service';
import { LocalTupleService } from './services/localtuple.service';
import { LoginService } from './services/login.service';
import { MailService } from './services/mail.service';
import { MicrosoftAuthService } from './services/microsoftAuth.service';
import { MinioService } from './services/minio.service';
import { ModalService } from './services/modal.service';
import { MongoService } from './services/mongo.service';
import { MyAudioService } from './services/myaudio.service';
import { OpenCVService } from './services/opencv.service';
import { PageService } from './services/page.service';
import { PayuService } from './services/payu.service';
import { TranslateService } from './services/translate.service';
import { TupleService } from './services/tuple.service';
import { MyUserService } from './services/user.service';
import { WebcamService } from './services/webcam.service';

@NgModule({
  declarations: [
    CardComponent,
    ImagepickerComponent,
    StatusbarComponent,
    FechaCardPipe,
    TxtfileeditorComponent,
    BlobeditorComponent,
    FileordevicepopupComponent,
    FilepickerComponent,
    CanvaseditorComponent,
    ScrollnavComponent,
    ScrollfilesComponent,
    PrejsonComponent,
    ScrollfileComponent,
    SortByNamePipe,
    JsonColorPipe,
    Epoch2datePipe,
    TranslatePipe,
    Json2svg,
    NgInit,
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
    SortByNamePipe,
    JsonColorPipe,
    FechaCardPipe,
    Epoch2datePipe,
    TranslatePipe,
    Json2svg,
    NgInit,
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
  ],
  providers: [
    Json2svg,
    NgInit,
    // Services
    AuthService,
    AuthorizationService,
    BackendPageService,
    CallService,
    DictateService,
    FileService,
    FlowchartService,
    GceService,
    HttpService,
    ImagedetectionService,
    ImageiationService,
    IndicatorService,
    LocalFileService,
    LocalPageService,
    LocalTupleService,
    LoginService,
    MailService,
    MicrosoftAuthService,
    MinioService,
    ModalService,
    MongoService,
    MyAudioService,
    OpenCVService,
    PageService,
    PayuService,
    TranslateService,
    TupleService,
    MyUserService,
    WebcamService
  ],
})
export class MycommonModule {}
