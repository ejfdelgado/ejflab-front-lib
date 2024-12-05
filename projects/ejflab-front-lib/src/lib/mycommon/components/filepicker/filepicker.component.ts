import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from '../../services/file.service';
import { WebcamService } from '../../services/webcam.service';
import { FileordevicepopupComponent } from '../fileordevicepopup/fileordevicepopup.component';
import { IdGen } from '@ejfdelgado/ejflab-common/src/IdGen';
import { FileRequestData } from '../../services/fileInterface';

@Component({
  selector: 'app-filepicker',
  templateUrl: './filepicker.component.html',
  styleUrls: ['./filepicker.component.css'],
  standalone: false,
})
export class FilepickerComponent implements OnInit {
  @ViewChild('imageInput') imageInput: ElementRef;
  imageInputBinded = false;
  lastDefaultFileName?: string | null = null;
  constructor(
    private fileSrv: FileService,
    private dialog: MatDialog,
    private webcamSrv: WebcamService
  ) {}

  ngOnInit(): void {
    const openFileRequestThis = this.openFileRequest.bind(this);
    this.fileSrv.subscribe(openFileRequestThis);
  }

  private async openFileRequest(payload: FileRequestData) {
    // file, fileimage, photo, fileimage-photo
    this.lastDefaultFileName = payload.defaultFileName;
    const nativeElement = this.imageInput.nativeElement;
    nativeElement.value = '';
    if (payload.type == 'file') {
      // Open file picker image
      nativeElement.accept = '';
      if (typeof payload.mimeType == 'string') {
        nativeElement.accept = payload.mimeType;
      }
      nativeElement.click();
    } else if (payload.type == 'fileimage') {
      // Open file picker general file
      nativeElement.accept = 'image/*';
      nativeElement.click();
    } else if (payload.type == 'fileaudio') {
      // Open file picker general file
      nativeElement.accept = 'audio/*';
      nativeElement.click();
    } else if (payload.type == 'fileimage-photo') {
      // Open modal (photo/file)
      this.dialog.open(FileordevicepopupComponent, {
        data: {
          type: 'image',
          defaultFileName: payload.defaultFileName,
        },
      });
    } else if (payload.type == 'photo') {
      // Open photo
      const respuesta = await this.webcamSrv.openWebcam({});
      if (!respuesta.canceled) {
        let fileName = payload.defaultFileName;
        if (!fileName) {
          fileName = IdGen.nuevo(new Date().getTime()) + '.jpg';
        }
        this.fileSrv.sendResponse({
          fileName: fileName,
          base64: respuesta.base64,
          canceled: false,
        });
      }
    }
  }

  async processFile(textInput: any) {
    const getBase64 = async (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', async (event: any) => {
          const base64 = event.target.result;
          resolve({
            base64,
            fileName: file.name,
          });
        });
        reader.addEventListener('error', (event) => {
          reject(event);
        });
        if (file instanceof Blob) {
          reader.readAsDataURL(file);
        }
      });
    };

    const files = textInput.files;
    const promesas = [];
    for (let i = 0; i < files.length; i++) {
      promesas.push(getBase64(files[i]));
    }

    try {
      const resultados: any = await Promise.all(promesas);
      let base64: any;
      let fileName: any;
      if (resultados.length == 1) {
        base64 = resultados[0].base64;
        fileName = this.lastDefaultFileName
          ? this.lastDefaultFileName
          : resultados[0].fileName;
      } else {
        base64 = resultados.map((el: any) => el.base64);
        fileName = resultados.map((el: any) => {
          return this.lastDefaultFileName
            ? this.lastDefaultFileName
            : el.fileName;
        });
      }
      this.fileSrv.sendResponse({
        canceled: false,
        base64: base64,
        fileName: fileName,
      });
    } catch (err) {}
  }
}
