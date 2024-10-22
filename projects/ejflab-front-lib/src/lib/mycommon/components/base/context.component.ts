import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FlowchartService } from '../../services/flowchart.service';
import { CallService } from '../../services/call.service';
import { MyTuples } from '@ejfdelgado/ejflab-common/src/MyTuples';
import { SendLiveChangesProcessor } from './processors/SendLiveChangesProcessor';
import { Socket } from 'socket.io-client';
import { MyCookies } from '@ejfdelgado/ejflab-common/src/MyCookies';
import { ImagiationDataQuery } from '../../services/imagiation.service';
import { MyDatesFront } from '@ejfdelgado/ejflab-common/src/MyDatesFront';
import { PromiseEmitter } from './PromiseEmitter';
import { ModalService } from '../../services/modal.service';
import { RTCCom } from './RTCCom';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';

export interface FlowChartRef {
  room?: string;
  names: { [key: string]: string };
  dataVal?: { [key: string]: any };
  dataPath: { [key: string]: string };
  conf: { sleep: number; debug: boolean };
  autoStart?: boolean;
}

export interface LiveModelConfigData {
  roomName: string;
  MAX_SEND_SIZE: number;
  LOW_PRESSURE_MS: number;
  BACK_OFF_MULTIPLIER: number;
}

export interface ChangesData {
  r: string;
  t: string;
  orig?: string | null;
  '+': Array<{ k: string; v: string }>;
  '-': Array<{ k: string; v: string }>;
  '*': Array<{ k: string; v: string }>;
  total: number;
}

@Component({
  selector: 'app-context-component',
  template: ` <div></div> `,
  styles: [],
})
export abstract class ContextComponent implements OnInit, OnDestroy {
  @ViewChildren('remote_video') remoteVideoRefs: QueryList<ElementRef>;
  @ViewChildren('remote_audio') remoteAudioRefs: QueryList<ElementRef>;
  log: Array<string> = [];
  errors: Array<string> = [];
  socketId?: string | null = null;
  userList: Array<string> = [];
  builder: any;
  livemodel: any = {};
  connectionState: string = 'offline';
  builderConfig: LiveModelConfigData = {
    roomName: 'public',
    MAX_SEND_SIZE: 1000,
    LOW_PRESSURE_MS: 100,
    BACK_OFF_MULTIPLIER: 100,
  };
  querySearchParams: ImagiationDataQuery = {
    max: 10,
    min_offset: 0,
    offset: 0,
    max_date: 0,
    min_date: 0,
    max_count: 0,
  };
  disconnectPromise: PromiseEmitter | null = null;

  constructor(
    public flowchartSrv: FlowchartService,
    public callService: CallService,
    public modalService: ModalService,
    public cdr: ChangeDetectorRef
  ) {
    const urlParams = new URLSearchParams(window.location.search);
    // Override room from query param
    this.builderConfig.roomName = this.readQueryParam(
      urlParams,
      'room',
      'text',
      'public'
    );
  }

  ngOnInit(): void {
    this.setModel({});
  }

  getRoot() {
    return MyConstants.SRV_ROOT;
  }

  abstract bindEvents(): any;

  async processOutgoingChanges(payload: ChangesData) {
    new SendLiveChangesProcessor(this).execute(payload);
  }

  trackChanges(filterRoutes: Array<string>) {
    const differences1: ChangesData = this.builder.trackDifferences(
      this.livemodel,
      [],
      null,
      filterRoutes
    );
    //console.log(JSON.stringify(differences1, null, 4));
    if (differences1.total > 0) {
      differences1.orig = this.socketId;
      this.builder.affect(differences1);
    }
  }

  getCallServiceInstance() {
    const roomName = this.builderConfig.roomName;
    //console.log(`getCallServiceInstance for ${roomName}`);
    return this.callService.getInstance(roomName);
  }

  async socketIoReconnect(config?: LiveModelConfigData) {
    await this.socketIoDisconnect();
    setTimeout(async () => {
      await this.socketIoConnect(config);
    }, 0);
  }

  async socketIoConnect(config?: LiveModelConfigData) {
    if (config) {
      this.builderConfig = config;
    }
    try {
      const waitUntilConnection = false;
      const socket = await this.getCallServiceInstance().beginConnection(
        {
          room: this.builderConfig.roomName,
          uuid: this.getSessionStorageValue('ANONYMOUS_USER'),
        },
        waitUntilConnection
      );
      this.connectionState = 'online';
      if (this.socketId === null) {
        this.bindEvents();
        this.bindBasic(socket);
      }
      await this.getCallServiceInstance().waitUntilConnection();
      this.getCallServiceInstance().emitEvent('askRoom', {
        room: this.builderConfig.roomName,
      });
    } catch (err: any) {
      this.connectionState = 'offline';
    }
  }

  bindBasic(socket: Socket) {
    const instance = this.getCallServiceInstance();
    socket.on('connect', () => {
      this.disconnectPromise = new PromiseEmitter();
      console.log(
        `context: ${new Date()} connect to ${
          this.builderConfig.roomName
        } with ${socket.id}`
      ); // OK
      this.connectionState = 'online';
      this.socketId = socket.id;
      instance.emitEvent('getModel', {});
    });
    socket.on('disconnect', () => {
      if (this.disconnectPromise) {
        this.disconnectPromise.resolve({});
      }
      console.log(
        `context: ${new Date()} disconnect from ${this.builderConfig.roomName}`
      ); // OK
      this.connectionState = 'offline';
      this.socketId = null;
    });
    socket.on('reconnect', () => {
      console.log('context: reconnect...'); //Not fired
      this.connectionState = 'online';
      this.socketId = socket.id;
      instance.emitEvent('getModel', {});
    });
    socket.on('reconnecting', (nextRetry) => {
      console.log('context: reconnecting...'); //Not fired
      this.connectionState = 'reconnecting';
      this.socketId = null;
    });
    socket.on('reconnect_failed', () => {
      console.log('context: reconnect_failed...'); //Not fired
      this.connectionState = 'offline';
      this.socketId = null;
    });
    socket.on('flowchartLoaded', () => {
      this.onFlowChartLoaded();
    });
    socket.on('flowchartUnloaded', () => {
      this.onFlowChartUnloaded();
      this.errors = [];
      this.cdr.detectChanges();
    });
    socket.on('myerror', (errorDate) => {
      const date = MyDatesFront.formatDateCompleto(new Date());
      const nuevo: Array<string> = [date + ': ' + errorDate.message];
      Array.prototype.push.apply(nuevo, this.errors);
      this.errors = nuevo;
    });
  }

  async onFlowChartLoaded() {}

  async onFlowChartUnloaded() {}

  async socketIoDisconnect() {
    console.log('socketIoDisconnect');
    const instance = this.getCallServiceInstance();
    if (!instance) {
      return;
    }
    instance.unregisterAllProcessors();
    instance.endConnection();
    this.userList = [];
    this.socketId = null;
    this.log = [];
    if (this.disconnectPromise) {
      await this.disconnectPromise.then;
    }
  }

  setModel(model: any) {
    this.livemodel = model;
    this.builder = MyTuples.getBuilder(this.builderConfig);
    const processOutgoingChangesThis = this.processOutgoingChanges.bind(this);
    this.builder.setProcesor(processOutgoingChangesThis);
    this.builder.build(this.livemodel);
    this.builder.end();
  }

  loadFlowChart(flowChartRef: FlowChartRef) {
    this.getCallServiceInstance().emitEvent('loadFlowchart', flowChartRef);
    this.errors = [];
  }

  async destroyModel() {
    const response = await this.modalService.confirm({
      title: '¿Está seguro?',
      txt: 'Esta acción no se puede deshacer.',
    });
    if (!response) {
      return;
    }
    this.getCallServiceInstance().emitEvent('destroyModel', {});
  }

  async connectToRoomName(roomName: string) {
    /*
    if (this.callService.isConnectedToRoom(roomName)) {
      return;
    }
    */
    //console.log(`Disconnect from ${this.builderConfig.roomName}`);
    await this.socketIoDisconnect();
    this.builderConfig = {
      roomName,
      MAX_SEND_SIZE: 1000,
      LOW_PRESSURE_MS: 100,
      BACK_OFF_MULTIPLIER: 100,
    };
    //console.log(`Connect to ${roomName}`);
    await this.socketIoConnect(this.builderConfig);
  }

  setSessionStorageValue(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  getSessionStorageValue(key: string) {
    return sessionStorage.getItem(key);
  }

  setCookie(cname: string, cvalue: string, exdays: number = 10000) {
    return MyCookies.setCookie(cname, cvalue, exdays);
  }

  getCookie(cname: string) {
    return MyCookies.getCookie(cname);
  }

  deleteCookie(cname: string) {
    return MyCookies.deleteCookie(cname);
  }

  ngOnDestroy(): void {
    this.socketIoDisconnect();
  }

  readQueryParam(
    urlParams: URLSearchParams,
    name: string,
    type: string,
    defValue: any
  ) {
    let val = defValue;
    const raw = urlParams.get(name);
    if (type == 'number') {
      if (raw != null) {
        val = parseInt(raw);
        if (isNaN(val)) {
          val = defValue;
        }
      }
    } else {
      val = raw;
    }
    if (!val) {
      val = defValue;
    }
    return val;
  }

  readQueryparams() {
    const urlParams = new URLSearchParams(window.location.search);
    this.querySearchParams.min_offset = this.readQueryParam(
      urlParams,
      'min_offset',
      'number',
      0
    );
    this.querySearchParams.max_count = this.readQueryParam(
      urlParams,
      'max_count',
      'number',
      0
    );
    this.querySearchParams.max = this.readQueryParam(
      urlParams,
      'max',
      'number',
      10
    );
    const max_date = this.readQueryParam(urlParams, 'max_date', 'number', 0);
    if (max_date > 0) {
      this.querySearchParams.max_date =
        MyDatesFront.AAAAMMDDhhmmss2unixUTC(max_date);
    }
    const min_date = this.readQueryParam(urlParams, 'min_date', 'number', 0);
    if (min_date > 0) {
      this.querySearchParams.min_date =
        MyDatesFront.AAAAMMDDhhmmss2unixUTC(min_date);
    }
  }

  downloadTextAsFile(filename: string, text: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  async blob2Base64(blob: Blob): Promise<string> {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result?.toString();
        if (base64String) {
          resolve(base64String);
        } else {
          reject(Error('El base 64 es vacío'));
        }
      };
      reader.onerror = (err) => {
        reject(err);
      };
    });
  }

  registerVideoElements() {
    this.remoteVideoRefs.toArray().forEach((videoRef) => {
      //console.log(videoRef);
      const socketIdRef = videoRef.nativeElement.getAttribute('data-socket-id');
      console.log(
        `registerVideoElements(${socketIdRef}, ${videoRef.nativeElement})`
      );
      RTCCom.registerVideoElement(socketIdRef, videoRef.nativeElement);
    });
  }

  registerAudioElements() {
    this.remoteAudioRefs.toArray().forEach((audioRef) => {
      //console.log(audioRef);
      const socketIdRef = audioRef.nativeElement.getAttribute('data-socket-id');
      console.log(
        `registerAudioElements(${socketIdRef}, ${audioRef.nativeElement})`
      );
      RTCCom.registerAudioElement(socketIdRef, audioRef.nativeElement);
    });
  }

  sleep(millis: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, millis);
    });
  }
}
