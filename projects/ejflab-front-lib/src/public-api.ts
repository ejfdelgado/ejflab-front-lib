/// <reference path="./index.d.ts" />
/*
 * Public API Surface of ejflab-front-lib
 */

// Services
export * from './lib/mycommon/services/authorization.service';
export * from './lib/mycommon/services/auth.service';
export * from './lib/mycommon/services/backendPage.service';
export * from './lib/mycommon/services/call.service';
export * from './lib/mycommon/services/dictate-service';
export * from './lib/mycommon/services/fileInterface';
export * from './lib/mycommon/services/file.service';
export * from './lib/mycommon/services/flowchart.service';
export * from './lib/mycommon/services/gce.service';
export * from './lib/mycommon/services/http.service';
export * from './lib/mycommon/services/imagedetection.service';
export * from './lib/mycommon/services/imagiation.service';
export * from './lib/mycommon/services/indicator.service';
export * from './lib/mycommon/services/localfilejson';
export * from './lib/mycommon/services/localfile.service';
export * from './lib/mycommon/services/localpage.service';
export * from './lib/mycommon/services/localtuple.service';
export * from './lib/mycommon/services/login.service';
export * from './lib/mycommon/services/mail.service';
export * from './lib/mycommon/services/microsoftAuth.service';
export * from './lib/mycommon/services/minio.service';
export * from './lib/mycommon/services/modal.service';
export * from './lib/mycommon/services/mongo.service';
export * from './lib/mycommon/services/myaudio.service';
export * from './lib/mycommon/services/opencv.service';
export * from './lib/mycommon/services/page.service';
export * from './lib/mycommon/services/payu.service';
export * from './lib/mycommon/services/picture360.service';
export * from './lib/mycommon/services/translate.service';
export * from './lib/mycommon/services/tuple.service';
export * from './lib/mycommon/services/user.service';
export * from './lib/mycommon/services/webcam.service';

// Extra
export * from './lib/mycommon/interceptors/JwtInterceptor';

// Components
export * from './lib/mycommon/components/adduserrolepopup/adduserrolepopup.component';
export * from './lib/mycommon/components/alert/alert.component';
export * from './lib/mycommon/components/authorizationpopup/authorizationpopup.component';
export * from './lib/mycommon/components/base/base.component';
export * from './lib/mycommon/components/base/baseMs.component';
export * from './lib/mycommon/components/base/context.component';
export * from './lib/mycommon/components/blobeditor/blobeditor.component';
export * from './lib/mycommon/components/canvaseditor/canvaseditor.component';
export * from './lib/mycommon/components/card/card.component';
export * from './lib/mycommon/components/confirm/confirm.component';
export * from './lib/mycommon/components/fileordevicepopup/fileordevicepopup.component';
export * from './lib/mycommon/components/filepicker/filepicker.component';
export * from './lib/mycommon/components/generic/generic.component';
export * from './lib/mycommon/components/imagepicker/imagepicker.component';
export * from './lib/mycommon/components/indicator/indicator.component';
export * from './lib/mycommon/components/loginpopup/loginpopup.component';
export * from './lib/mycommon/components/multiplepages/multiplepages.component';
export * from './lib/mycommon/components/pagepopup/pagepopup.component';
export * from './lib/mycommon/components/payupopup/payupopup.component';
export * from './lib/mycommon/components/prejson/prejson.component';
export * from './lib/mycommon/components/scrollfile/scrollfile.component';
export * from './lib/mycommon/components/scrollfiles/scrollfiles.component';
export * from './lib/mycommon/components/scrollnav/scrollnav.component';
export * from './lib/mycommon/components/statusbar/statusbar.component';
export * from './lib/mycommon/components/txtfileeditor/txtfileeditor.component';
export * from './lib/mycommon/components/userpopup/userpopup.component';
export * from './lib/mycommon/components/webcam/webcam.component';

// Pipes
export * from './lib/mycommon/pipes/epoch2date.pipe';
export * from './lib/mycommon/pipes/fecha-card.pipe';
export * from './lib/mycommon/pipes/json-color.pipe';
export * from './lib/mycommon/pipes/json2svg.pipe';
export * from './lib/mycommon/pipes/sort-by-name.pipe';
export * from './lib/mycommon/pipes/translate.pipe';

// Directives
export * from './lib/mycommon/directives/NgInit';

// Interfaces
export * from './lib/mycommon/components/base/VideoWebStream';
export * from './lib/mycommon/components/base/RTCCom';
export * from './lib/mycommon/components/base/PromiseEmitter';
export * from './lib/mycommon/components/base/EmitterThen';
export * from './lib/mycommon/components/base/processors/BaseProcesor';
export * from './lib/mycommon/components/base/processors/EchoLogProcessor';
export * from './lib/mycommon/components/base/processors/ReceiveLiveChangesProcessor';
export * from './lib/mycommon/components/base/processors/RemoveUserProcessor';
export * from './lib/mycommon/components/base/processors/SendLiveChangesProcessor';
export * from './lib/mycommon/components/base/processors/SetModelProcessor';
export * from './lib/mycommon/components/base/processors/UpdateUserListProcessor';

export * from './lib/mycommon/validators/MultipleEmailValidator';
export * from './lib/mycommon/interfaces/login-data.interface';

// Module
export * from './lib/mycommon/mycommon.module';
