import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/authorization.service';
import { BackendPageService } from '../../services/backendPage.service';
import { LoginService } from '../../services/login.service';
import { ModalService } from '../../services/modal.service';
import { PageService } from '../../services/page.service';
import { MyUserData, MyUserOptionsData, MyUserService } from '../../services/user.service';
import { MyRoutes } from '@ejfdelgado/ejflab-common/src/MyRoutes';

import { Auth, User } from '@angular/fire/auth';
import { PageData } from '../../interfaces/login-data.interface';
import { Subscription } from 'rxjs';

export interface StatusBarOptionsData {
  editDocument?: boolean;
  editDocumentPermissions?: boolean;
  deleteDocument?: boolean;
  createDocument?: boolean;
  searchDocuments?: boolean;
  displayUserName?: boolean;
}

export interface OptionData {
  icon: string;
  label: string;
  action: Function;
}

@Component({
  selector: 'app-statusbar',
  templateUrl: './statusbar.component.html',
  styleUrls: ['./statusbar.component.css'],
})
export class StatusbarComponent implements OnInit, OnDestroy {
  @Input('title')
  title: string | null;
  @Input() options: StatusBarOptionsData = {
    createDocument: true,
    deleteDocument: true,
    editDocument: true,
    editDocumentPermissions: true,
    searchDocuments: true,
    displayUserName: false,
  };
  @Input() textStyle: { [key: string]: string } = {
    "color": "#000000",
  };
  @Input() backgroundStyle: { [key: string]: string } = {
    "background-color": "#eef7ff",
  };
  @Input() userOptions: MyUserOptionsData = {
    editEmail: true,
    editName: true,
    editPhone: true,
  };
  @Input('extraOptions')
  extraOptions: Array<OptionData> = [];
  @Input('saveState') saveState: string | null = null;
  user: User | null = null;
  dbUser: MyUserData | null = null;
  dbUserSubscription: Subscription | null = null;
  updateCount: number = 0;

  constructor(
    private loginSrv: LoginService,
    private pageSrv: PageService,
    private authorizationSrv: AuthorizationService,
    private backendPageSrv: BackendPageService,
    private usrSrv: MyUserService,
    private modalSrv: ModalService,
    private auth: Auth,
  ) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  ngOnInit(): void {
    this.dbUserSubscription = this.usrSrv.eventoUsuario.subscribe((dbUser) => {
      this.dbUser = dbUser;
      this.updateCount = Date.now();
    });
  }

  async editPage() {
    this.pageSrv.edit();
  }

  async deleteAllTuples() {
    const responseConfirm = await this.modalSrv.confirm({
      title: '¿Está seguro?',
      txt: 'Esta acción no se puede deshacer.',
    });
    if (!responseConfirm) {
      return;
    }
    this.backendPageSrv
      .getCurrentPage()
      .then(async (data: PageData | null) => {
        if (data) {
          await this.pageSrv.deleteAllTuples({ id: data.id });
          window.location.reload();
        }
      })
      .catch((err) => {
        this.modalSrv.error(err);
      });
  }

  async editPagePermisions() {
    this.authorizationSrv.edit();
  }

  async createNewPage() {
    const dato = await this.pageSrv.createNew();
    const partes = MyRoutes.splitPageData(location.pathname);
    const URL = `${location.origin}${partes.pageType}/${dato.id}`;
    window.open(URL, '_self');
  }

  async lookMyPages() {
    this.pageSrv.multiple();
  }

  async goToHome() { }

  async logoutAndGoToHome() {
    await this.loginSrv.logout();
  }

  async editUser() {
    this.usrSrv.edit(this.userOptions);
  }

  async logout() {
    this.loginSrv.logout();
  }

  async login() {
    this.loginSrv.login();
  }

  getUserName() {
    if (this.dbUser?.name) {
      return this.dbUser?.name;
    }
    if (this.user?.displayName) {
      return this.user.displayName;
    }
    return "";
  }

  getPhoto() {
    if (this.dbUser?.picture) {
      return this.dbUser.picture + `?t=${this.updateCount}`;
    }
    if (this.user?.photoURL) {
      return this.user.photoURL + `?t=${this.updateCount}`;
    }
    return "";
  }

  async ngOnDestroy() {
    if (this.dbUserSubscription) {
      this.dbUserSubscription.unsubscribe();
    }
  }
}
