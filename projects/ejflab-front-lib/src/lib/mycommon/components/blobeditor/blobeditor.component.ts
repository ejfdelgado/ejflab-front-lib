import { HttpClient } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/services/modal.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { FileBase64Data } from 'src/app/components/base/base.component';
import { FileResponseData, FileService } from 'src/services/file.service';
import { FileSaveData } from 'src/services/fileInterface';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';

export interface BlobOptionsData {
  useRoot?: string;
  isEditable?: boolean;
  autosave?: boolean;
  isPublic?: boolean;
  isFake?: boolean;
}

@Component({
  selector: 'app-blobeditor',
  templateUrl: './blobeditor.component.html',
  styleUrls: ['./blobeditor.component.css'],
})
export class BlobeditorComponent implements OnInit {
  @Input() options: BlobOptionsData;
  @Input() subFolder?: string;
  @Input() url: string | null;
  @Output() urlChange = new EventEmitter<string | null>();
  @Output() eventSave = new EventEmitter<FileBase64Data>();
  constructor(
    private httpClient: HttpClient,
    private clipboard: Clipboard,
    private modalSrv: ModalService,
    public fileService: FileService
  ) {}

  ngOnInit(): void {}

  makePublic() {
    //console.log(`this.url=${this.url}`);
  }

  async download() {
    const theUrl = MyConstants.getCompleteUrl(this.url + '&download=1');
    if (theUrl) {
      window.open(theUrl, '_blank');
    }
  }

  async share() {
    const theUrl = MyConstants.getCompleteUrl(this.url);
    if (theUrl) {
      this.clipboard.copy(theUrl);
      this.modalSrv.alert({ title: 'Ok!', txt: 'Enlace copiado' });
    }
  }

  getFileName() {
    if (!this.url) {
      return '';
    } else {
      const partes = /[^/]+$/g.exec(this.url);
      if (partes != null) {
        return partes[0].replace(/[?].*$/, '');
      } else {
        return '';
      }
    }
  }

  public async saveFile(options: FileSaveData, suffix: string = '') {
    try {
      const response = await this.fileService.save(options);
      response.key = response.key + '?t=' + new Date().getTime() + suffix;
      return response;
    } catch (err: any) {
      this.modalSrv.error(err);
      throw err;
    }
  }

  askForFile() {
    const processFileThis = this.processFile.bind(this);
    this.fileService.sendRequest({ type: 'file' }, processFileThis);
  }
  getSubFolder(): string {
    if (typeof this.subFolder == 'string') {
      // Se asegura que no comience con slash y que termine con slash y que no tenga backslash
      return (
        this.subFolder
          .replace(/[\\]/, '/')
          .replace(/^[/]/, '')
          .replace(/[/]$/, '')
          .replace(/[/]{2,}/, '/') + '/'
      );
    } else {
      return '';
    }
  }
  async processFile(responseData: FileResponseData) {
    const simpleFun = async (
      responseDatabase64: string,
      responseDatafileName: string
    ) => {
      if (this.options.isFake) {
        // Convert base64 to blob Url
        const indice = responseDatabase64.indexOf(';base64,');
        let mimeType = responseDatabase64.substring(0, indice);
        mimeType = mimeType.replace(/^data:/, '');
        const base64 = responseDatabase64.substring(indice + 8);
        const buff = Buffer.from(base64, 'base64');
        const blob = new Blob([buff], { type: mimeType });
        const nextUrl = URL.createObjectURL(blob);
        if (typeof this.url == 'string' && this.url.startsWith('blob:')) {
          URL.revokeObjectURL(this.url);
        }
        this.url = nextUrl;
        this.urlChange.emit(this.url);
      } else {
        if (this.options.autosave === true) {
          const response = await this.saveFile({
            base64: responseDatabase64,
            fileName: this.getSubFolder() + responseDatafileName,
            erasefile: this.url, // send old file
            isPublic: this.options.isPublic,
          });
          this.url = response.key;
          this.urlChange.emit(this.url);
        } else {
          this.eventSave.emit({
            base64: responseDatabase64,
            name: responseDatafileName,
            type: 'blob',
          });
        }
      }
    };
    if (responseData.base64 instanceof Array) {
      const fileNamesArray: any = responseData.fileName;
      for (let i = 0; i < responseData.base64.length; i++) {
        const responseDatabase64 = responseData.base64[i];
        const responseDatafileName = fileNamesArray[i];
        await simpleFun(responseDatabase64, responseDatafileName);
      }
    } else {
      const responseDatafileName: any = responseData.fileName;
      await simpleFun(responseData.base64, responseDatafileName);
    }
  }
}
