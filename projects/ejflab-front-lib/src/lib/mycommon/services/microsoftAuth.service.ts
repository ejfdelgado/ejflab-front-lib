import { Injectable, EventEmitter, Inject } from '@angular/core';
import * as msal from '@azure/msal-browser';
import { Subscription } from 'rxjs';

export interface UserMicrosoft {
  username: string;
  homeAccountId: string;
  name?: string;
  idToken?: string;
  groups: string[];
}

// https://graph.microsoft.com/v1.0/me/photos/648x648/$value
// https://graph.microsoft.com/v1.0/users/EJDelgado@NogalesPsychological.com/photo/$value
// https://entra.microsoft.com/
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md
@Injectable({
  providedIn: 'root',
})
export class MicrosoftAuthService {
  redirectUri = window.location.href;
  pca: Promise<msal.IPublicClientApplication>;
  accessToken: string | null;
  currentUser: UserMicrosoft | null = null;
  evento: EventEmitter<UserMicrosoft | null> = new EventEmitter();
  loginMode: 'select_account' | 'none' = 'select_account';

  constructor(
    @Inject('msTenant') private tenant: string,
    @Inject('msClientId') private clientId: string,
    @Inject('msGroupIdMap') private groupIdMap: { [key: string]: string },
  ) {
    this.createMicrosoftAuth();
  }

  onAuthStateChanged(fun: Function): Subscription {
    fun(this.currentUser);
    return this.evento.subscribe((dato) => {
      fun(dato);
    });
  }

  async createMicrosoftAuth() {
    const msalConfig = {
      auth: {
        clientId: this.clientId,
        authority: `https://login.microsoftonline.com/${this.tenant}`,
        redirectUri: this.redirectUri,
      },
    };
    this.pca = msal.createStandardPublicClientApplication(msalConfig);
    const msalInstance = await this.pca;
    // Acá se debe dar cuenta si está ya logeado alguien
    /*
    const accounts = msalInstance.getAllAccounts();
    let current = null;
    if (accounts.length > 0) {
      current = accounts[0];
    }
    */
    const current = msalInstance.getActiveAccount();
    if (current) {
      this.getSessionToken();
    }
  }

  async assignCurrentUserFromAccount(response: any) {
    this.accessToken = response.accessToken;
    const account = response.account;
    const msalInstance = await this.pca;
    msalInstance.setActiveAccount(account);
    const { username, homeAccountId, name, idToken } = account;
    this.currentUser = {
      username,
      homeAccountId,
      name,
      idToken,
      groups: [],
    };
    // get groups
    const groups = response.idTokenClaims?.groups;
    if (groups instanceof Array) {
      this.currentUser.groups = groups.map((idGroup: string) => {
        if (idGroup in this.groupIdMap) {
          return this.groupIdMap[idGroup];
        }
        return idGroup;
      });
    }
    this.evento.emit(this.currentUser);
  }

  async bindEvents() {
    const msalInstance = await this.pca;
    const callbackId = msalInstance.addEventCallback(
      (message: msal.EventMessage) => {
        const status =
          msal.EventMessageUtils.getInteractionStatusFromEvent(message);
        if (status === msal.InteractionStatus.None) {
          console.log(message.payload);
        }
      }
    );
    //console.log(callbackId);
  }

  async getSessionToken(): Promise<string> {
    const msalInstance = await this.pca;
    //const accounts = msalInstance.getAllAccounts();
    const current = msalInstance.getActiveAccount();
    if (!current) {
      return '';
    }
    const request = {
      scopes: ['User.Read'],
      account: current,
      //forceRefresh: true,//Just refresh when expired
      refreshTokenExpirationOffsetSeconds: 7200, // 2 hours * 60 minutes * 60 seconds = 7200 seconds
    };
    const response = await msalInstance.acquireTokenSilent(request);
    this.accessToken = response.accessToken;
    return response.accessToken;
  }

  async logout(): Promise<any> {
    const msalInstance = await this.pca;
    await msalInstance.logoutPopup();
    this.currentUser = null;
    this.evento.emit(null);
  }

  async login(): Promise<any> {
    if (this.currentUser == null) {
      const msalInstance = await this.pca;
      const response = await msalInstance.loginPopup({
        scopes: ['User.Read.All'],
        prompt: this.loginMode,
      });
      await this.assignCurrentUserFromAccount(response);
      return response;
    } else {
      return this.currentUser;
    }
  }

  getRoomNameFromUser(user: UserMicrosoft): string | null {
    const { username } = user;
    const partes = /^([^@]+)@/i.exec(username);
    if (partes == null) {
      return null;
    }
    return partes[1].toLocaleLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  getRoomNameFromPath(): string | null {
    const pathname = location.pathname;
    const partes = /room\/([^\/]+)$/.exec(pathname);
    if (partes) {
      return partes[1];
    }
    return null;
  }

  isUserInGroupInternal(user: UserMicrosoft | null, groups: string[], and: boolean) {
    if (!user) {
      return false;
    }
    const currentGroups = user.groups;
    const notMeet = groups.filter((group: string) => {
      if (currentGroups.indexOf(group) >= 0) {
        return false;
      }
      return true;
    });
    if (and) {
      //All must have
      return notMeet.length == 0;
    } else {
      // At least one
      return notMeet.length < groups.length;
    }
  }
}
