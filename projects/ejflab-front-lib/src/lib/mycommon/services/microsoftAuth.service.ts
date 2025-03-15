import { Injectable, EventEmitter, Inject, InjectionToken } from '@angular/core';
import * as msal from '@azure/msal-browser';
import { Subscription } from 'rxjs';

export interface UserMicrosoft {
  username: string;
  homeAccountId: string;
  name?: string;
  idToken?: string;
  groups: string[];
}

export interface GetAccountOptionData {
  forceRefresh?: boolean,
  refreshTokenExpirationOffsetSeconds?: number,
}

export const MS_LOGIN_MODE = new InjectionToken<string>('msLoginMode', {
  providedIn: 'root',
  factory: () => 'select_account',//select_account, none
});

// https://graph.microsoft.com/v1.0/me/photos/648x648/$value
// https://graph.microsoft.com/v1.0/users/EJDelgado@NogalesPsychological.com/photo/$value
// https://entra.microsoft.com/
// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md
@Injectable({
  providedIn: 'root',
})
export class MicrosoftAuthService {
  pca: Promise<msal.IPublicClientApplication>;
  accessToken: string | null;
  idToken: string | null;
  currentUser: UserMicrosoft | null = null;
  evento: EventEmitter<UserMicrosoft | null> = new EventEmitter();
  pathChangedEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    @Inject('msTenant') private tenant: string,
    @Inject('msClientId') private clientId: string,
    @Inject('msGroupIdMap') private groupIdMap: { [key: string]: string },
    @Inject(MS_LOGIN_MODE) private loginMode: string,
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
        authority: `https://login.microsoftonline.com/${this.tenant}/v2.0`,
        //authority: `https://sts.windows.net/${this.tenant}`,
        redirectUri: window.location.href.replace(/#.*$/, ''),
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

  public async assignCurrentUserFromAccount(response: any) {
    this.idToken = response.idToken;
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
    this.restoreHash();
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

  public async refreshActiveAccount(redirectIdNoUser?: string): Promise<boolean> {
    const response = await this.getActiveAccount();
    if (response) {
      await this.assignCurrentUserFromAccount(response);
    }
    if (!this.currentUser) {
      if (redirectIdNoUser) {
        window.location.href = redirectIdNoUser;
      }
      return false;
    } else {
      return true;
    }
  }

  public async getActiveAccount(options: GetAccountOptionData | null = null): Promise<msal.AuthenticationResult | null> {
    let defaults = {
      forceRefresh: false,
      refreshTokenExpirationOffsetSeconds: 32400, // 9 hours * 60 minutes * 60 seconds = 7200 seconds
    };
    if (typeof options == "object") {
      defaults = Object.assign(defaults, options);
    }
    const msalInstance = await this.pca;
    //const accounts = msalInstance.getAllAccounts();
    const current = msalInstance.getActiveAccount();
    if (!current) {
      return null;
    }
    const request = {
      scopes: ['User.Read'],
      account: current,
      forceRefresh: defaults.forceRefresh,
      refreshTokenExpirationOffsetSeconds: defaults.refreshTokenExpirationOffsetSeconds
    };
    const response = await msalInstance.acquireTokenSilent(request);
    return response;
  }

  public async getSessionToken(type = "session"): Promise<string> {
    const response = await this.getActiveAccount();
    if (!response) {
      return '';
    }
    this.idToken = response.idToken;
    this.accessToken = response.accessToken;
    if (type == "session") {
      return response.accessToken;
    } else {
      return response.idToken;
    }
  }

  async logout(): Promise<any> {
    const msalInstance = await this.pca;
    await msalInstance.logoutPopup();
    this.currentUser = null;
    this.evento.emit(null);
  }

  hideHash() {
    const parts = /^[^#]+#(.+)$/.exec(location.href);
    if (parts) {
      const hash = parts[1];
      if (hash.length > 0) {
        sessionStorage.setItem("NOGALES_HASH", hash);
        location.hash = '';
      }
    }
  }

  restoreHash() {
    const hash = sessionStorage.getItem("NOGALES_HASH");
    if (hash && hash.length > 0) {
      sessionStorage.setItem("NOGALES_HASH", "");
      location.hash = hash;
      //this.router.navigate(hash.split("/"));
      this.pathChangedEvent.emit(hash);
      return true;
    }
    return false;
  }

  async login(force: boolean = false): Promise<any> {
    this.hideHash();
    if (this.currentUser == null || force) {
      const msalInstance = await this.pca;
      let loginMode = "none";
      if (this.loginMode && this.loginMode.length > 0) {
        loginMode = this.loginMode;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      if (mode && mode.length > 0) {
        loginMode = mode;
      }
      const response = await msalInstance.loginPopup({
        scopes: ['User.Read.All'],
        prompt: loginMode,
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
