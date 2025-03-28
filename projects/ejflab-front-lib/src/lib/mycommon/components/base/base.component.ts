import { Buffer } from 'buffer';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BackendPageService } from '../../services/backendPage.service';
import { FileService } from '../../services/file.service';
import { ModalService } from '../../services/modal.service';
import {
  TupleService,
  TupleServiceInstance,
} from '../../services/tuple.service';
import {
  WebcamRequestData,
  WebcamResponseData,
  WebcamService,
} from '../../services/webcam.service';
import { IdGen } from '@ejfdelgado/ejflab-common/src/IdGen';
import { MyDatesFront } from '@ejfdelgado/ejflab-common/src/MyDatesFront';
import { FileSaveData } from '../../services/fileInterface';
import { ContextComponent } from './context.component';
import { FlowchartService } from '../../services/flowchart.service';
import { CallService } from '../../services/call.service';
import { PageData } from '../../interfaces/login-data.interface';

export interface FileBase64Data {
  base64?: string;
  name: string;
  type: string;
  key?: string;
}

@Component({
  selector: 'app-base',
  template: ` <div></div> `,
  styles: [],
})
export abstract class BaseComponent
  extends ContextComponent
  implements OnInit, OnDestroy {
  tupleModel: any | null = null;
  page: PageData | null = null;
  currentUser: User | null = null;
  loginSubscription: Subscription | null = null;
  pageSubscription: Subscription | null = null;
  tupleSubscription: Subscription | null = null;
  tupleServiceInstance: TupleServiceInstance | null;
  saveState: string | null = null;

  constructor(
    public override flowchartSrv: FlowchartService,
    public override callService: CallService,
    public route: ActivatedRoute,
    public pageService: BackendPageService,
    public override cdr: ChangeDetectorRef,
    public authService: AuthService,
    public dialog: MatDialog,
    public tupleService: TupleService,
    public fileService: FileService,
    public override modalService: ModalService,
    public webcamService: WebcamService,
    public auth: Auth,
  ) {
    super(flowchartSrv, callService, modalService, cdr);
  }

  private setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.cdr.detectChanges();
  }

  async openWebcam(request: WebcamRequestData): Promise<WebcamResponseData> {
    return this.webcamService.openWebcam(request);
  }

  async generateId(): Promise<string> {
    const time = MyDatesFront.getServerTime();
    let respuesta: string | null = await IdGen.nuevo(time);
    if (respuesta) {
      return respuesta;
    } else {
      return '';
    }
  }

  private updateDinamicallyOgData(page: PageData | null) {
    if (page != null) {
      if (page.tit) {
        document.title = page.tit;
        // document.getElementById('meta_page_id')?.getAttribute("content");
        const metaPageId = document.getElementById('meta_page_id');
        if (metaPageId && typeof page.id == 'string') {
          metaPageId.setAttribute('content', page.id);
        }
      }
    }
  }

  public async saveTextFile(options: FileSaveData, suffix: string = '') {
    options.base64 =
      'data:text/plain;base64,' +
      Buffer.from(options.base64, 'utf8').toString('base64');
    return this.saveFile(options);
  }

  public async saveFile(options: FileSaveData, suffix: string = '') {
    try {
      const response = await this.fileService.save(options);
      response.key = response.key + '?t=' + new Date().getTime() + suffix;
      return response;
    } catch (err: any) {
      this.modalService.error(err);
      throw err;
    }
  }

  public addKeyListener(key: string, callback: Function) {
    if (this.tupleServiceInstance) {
      this.tupleServiceInstance.addListener(key, callback);
    } else {
      throw new Error('No puede configurar el evento');
    }
  }

  public removeKeyListener(key: string, callback?: Function) {
    if (this.tupleServiceInstance) {
      this.tupleServiceInstance.removeListener(key, callback);
    } else {
      throw new Error('No puede configurar el evento');
    }
  }

  public saveTuple() {
    if (this.tupleServiceInstance) {
      this.tupleServiceInstance.setBlackKeyPatterns([
        /models\.[^.]+\.videoUrl$/,
      ]);
      this.tupleServiceInstance.save(this.tupleModel);
    }
  }

  getPageTitle() {
    if (this.page) {
      return this.page.tit ? this.page.tit : 'Título';
    } else {
      return 'Título';
    }
  }

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    const updateDinamicallyOgDataThis = this.updateDinamicallyOgData.bind(this);
    this.pageSubscription = this.pageService.evento.subscribe(
      updateDinamicallyOgDataThis
    );

    this.auth.onAuthStateChanged(async (user) => {
      if (user == null) {
        this.page = null;
        this.setCurrentUser(null);
      } else {
        const promesas: Array<Promise<any>> = [];
        promesas.push(this.pageService.getCurrentPage());
        promesas.push(this.authService.getCurrentUser());

        const respuestas = await Promise.all(promesas);
        this.page = respuestas[0];
        this.setCurrentUser(respuestas[1]);
        this.loginSubscription = this.authService
          .getLoginEvent()
          .subscribe((user: User | null) => {
            this.setCurrentUser(user);
          });
        this.route.params.subscribe((params) => {
          let pageId = null;
          if ('id' in params) {
            pageId = params['id'];
          } else {
            if (this.page && this.page.id) {
              pageId = this.page.id;
            }
          }
          if (pageId) {
            // Try to read tuples, should be optional
            this.tupleServiceInstance = this.tupleService.getReader(pageId);
            this.tupleSubscription = this.tupleServiceInstance.evento.subscribe(
              (evento) => {
                //console.log(JSON.stringify(evento));
                if (evento.status == 'read_wip') {
                  // Show read indicator
                  this.saveState = 'processing';
                } else if (evento.status == 'read_done') {
                  // Stop read indicator
                  this.tupleModel = evento.body;
                  this.onTupleReadDone();
                  this.saveState = 'done';
                } else if (evento.status == 'news') {
                  // Stop read indicator
                  this.tupleModel = evento.body;
                  this.onTupleNews();
                } else if (evento.status == 'save_wip') {
                  // Show write indicator
                  this.saveState = 'processing';
                } else if (evento.status == 'save_done') {
                  // Stop write indicator
                  this.saveState = 'done';
                  this.onTupleWriteDone();
                }
              }
            );
          }
        });
      }
    });
  }

  onTupleReadDone() {
    // detect changes
    this.cdr.detectChanges();
  }

  onTupleNews() {
    // detect changes
    this.cdr.detectChanges();
  }

  onTupleWriteDone() { }

  override async ngOnDestroy() {
    await super.ngOnDestroy();
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.tupleSubscription) {
      this.tupleSubscription.unsubscribe();
    }
  }
}
