import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CallService } from '../../services/call.service';
import { FlowchartService } from '../../services/flowchart.service';
import {
  MicrosoftAuthService,
  UserMicrosoft,
} from '../../services/microsoftAuth.service';
import { ContextComponent } from './context.component';
import { ModalService } from '../../services/modal.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-base',
  template: ` <div></div> `,
  styles: [],
})
export abstract class BaseMsComponent
  extends ContextComponent
  implements OnInit, OnDestroy {
  currentUser: UserMicrosoft | null = null;
  currentUserUID: string = '';
  userSubscription: Subscription | null = null;
  srcImageBlob: any;
  constructor(
    public override flowchartSrv: FlowchartService,
    public override callService: CallService,
    public authSrv: MicrosoftAuthService,
    public override modalService: ModalService,
    public override cdr: ChangeDetectorRef
  ) {
    super(flowchartSrv, callService, modalService, cdr);
  }
  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.userSubscription = this.authSrv.onAuthStateChanged(
      (user: UserMicrosoft | null) => {
        this.currentUser = user;
        //this.getAvatarImage(user);
      }
    );
  }
  override async ngOnDestroy() {
    await super.ngOnDestroy();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
  async logout() {
    await this.authSrv.logout();
  }

  async login() {
    await this.authSrv.login();
  }

  async getCurrentUserUID() {
    const cookieKey = 'ANONYMOUS_USER';
    if (this.currentUser == null) {
      // Ask the cookie
      let oldValue = this.getSessionStorageValue(cookieKey);
      if (!oldValue) {
        // If not cookie, create id and store it in the cookie
        let roomName = this.authSrv.getRoomNameFromPath();
        if (!roomName) {
          roomName = 'public';
        }
        const randomId = uuidv4().replace(/-/g, '_');
        oldValue = `pat_${roomName}_${randomId}`;
        this.setSessionStorageValue(cookieKey, oldValue);
      }
      // Return cookie value
      this.currentUserUID = oldValue;
      return oldValue;
    } else {
      this.currentUserUID =
        'sig_' + this.authSrv.getRoomNameFromUser(this.currentUser);
      this.setSessionStorageValue(cookieKey, this.currentUserUID);
      return this.currentUserUID;
    }
  }

  getCurrentSrcImage() {
    if (this.srcImageBlob) {
      return this.srcImageBlob;
    } else {
      return this.getRoot() + `assets/img/avatar.svg`;
    }
  }

  async getAvatarImage(user: UserMicrosoft | null) {
    if (!user) {
      this.srcImageBlob = null;
      return;
    }
    const username = user.username;
    const sessionToken = await this.authSrv.getSessionToken();

    // ProfilePhoto.Read.All
    // ShowProfilePicToGuestUsers

    //const src = `https://graph.microsoft.com/v1.0/users/${username}/photo/$value`;
    const src = `https://graph.microsoft.com/v1.0/users/EJDelgado@NogalesPsychological.com/photo/$value`;
    //const src = `https://graph.microsoft.com/v1.0/me/photo/$value`;
    const options = {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    };

    const promise = new Promise((resolve, reject) => {
      fetch(src, options)
        .then((res) => res.blob())
        .then((blob) => {
          resolve(URL.createObjectURL(blob));
        })
        .catch((err) => {
          reject(err);
        });
    });
    this.srcImageBlob = await promise;
    return promise;
  }

  isUserInAllGroup(groups: string[]) {
    return this.authSrv.isUserInGroupInternal(this.currentUser, groups, true);
  }

  isUserInSomeGroup(groups: string[]) {
    return this.authSrv.isUserInGroupInternal(this.currentUser, groups, false);
  }
}
