import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Buffer } from 'buffer';
import { catchError, of } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { ModalService } from 'src/services/modal.service';
import { FileBase64Data } from 'src/app/components/base/base.component';
import { FileService } from 'src/services/file.service';
import { FileSaveData } from 'src/services/fileInterface';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';

export interface TxtOptionsData {
  encoding?: string;
  maxHeight?: string;
  height?: string;
  useRoot?: string;
}

@Component({
  selector: 'app-txtfileeditor',
  templateUrl: './txtfileeditor.component.html',
  styleUrls: ['./txtfileeditor.component.css'],
})
export class TxtfileeditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() options: TxtOptionsData;
  @Input() url: string;
  @Output() urlChange = new EventEmitter<string | null>();
  @Input() fileName: string;
  @Output() eventSave = new EventEmitter<FileBase64Data>();
  readonly control = new FormControl({
    value: '',
    disabled: false,
  });
  constructor(
    private httpClient: HttpClient,
    private clipboard: Clipboard,
    private modalSrv: ModalService,
    public fileService: FileService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  ngOnChanges(changes: any) {
    if (changes.url) {
      const url = changes.url.currentValue;
      if (typeof url == 'string' && url.length > 0) {
        this.control.disable();
        this.leer(url).finally(() => {
          this.control.enable();
        });
      }
    }
  }

  getStyles(): { [klass: string]: any } {
    const response: { [klass: string]: any } = {
      'max-height': '100%',
      height: '100%',
    };
    const PASS_THROUGH = [
      { in: 'maxHeight', out: 'max-height' },
      { in: 'height', out: 'height' },
    ];
    const localOptions: any = this.options;
    for (let i = 0; i < PASS_THROUGH.length; i++) {
      const actual = PASS_THROUGH[i];
      if (actual.in in localOptions) {
        response[actual.out] = localOptions[actual.in];
      }
    }
    return response;
  }

  htmlToText(html: string) {
    const tmp = document.createElement('DIV');
    tmp.setAttribute('style', 'white-space: pre;');
    console.log(html);
    html = html.replace(/<br\/?>/g, '\\n');
    console.log(html);
    tmp.innerHTML = html;
    let salida = tmp.textContent || tmp.innerText || '';
    salida = salida.replace(/\\n/g, '\n');
    return salida;
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

  async guardar() {
    const actual = this.control.value;
    if (typeof actual == 'string') {
      //let base64 = Buffer.from(this.htmlToText(actual), 'utf8').toString('base64');
      let base64 = Buffer.from(actual, 'utf8').toString('base64');
      base64 = `data:text/plain;base64,${base64}`;
      const response = await this.saveFile(
        {
          base64: base64,
          fileName: this.fileName,
        },
        '&encoding=utf8'
      );
      this.url = response.key;
      this.urlChange.emit(this.url);
    }
  }

  async download() {
    const theUrl = MyConstants.getCompleteUrl(this.url + '&download=1');
    if (theUrl != null) {
      window.open(theUrl, '_blank');
    }
  }

  async share() {
    const theUrl = MyConstants.getCompleteUrl(this.url);
    if (theUrl != null) {
      this.clipboard.copy(theUrl);
      this.modalSrv.alert({ title: 'Ok!', txt: 'Enlace copiado' });
    }
  }

  getValue() {
    return this.control.value;
  }

  async setValueAndSave(texto: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.control.setValue(texto);
      const guardarThis = this.guardar.bind(this);
      setTimeout(async () => {
        try {
          await guardarThis();
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 0);
    });
  }

  processFile(textInput: any) {
    const file: File = textInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      let temp = event.target.result;
      temp = temp.replace(/^.*base64,/, '');
      const texto = Buffer.from(temp, 'base64').toString('utf8');
      this.control.setValue(texto);
    });
    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    }
  }

  async leer(url: string) {
    const theUrl = MyConstants.getCompleteUrl(url);
    if (theUrl == null) {
      throw new Error('No puede leer una url nula');
    }
    const respuesta = await new Promise<string>((resolve, reject) => {
      this.httpClient
        .get(theUrl, { responseType: 'text' })
        .pipe(
          catchError((error) => {
            return of('');
          })
        )
        .subscribe((data) => {
          resolve(data);
        });
    });
    this.control.setValue(respuesta);
  }
}
