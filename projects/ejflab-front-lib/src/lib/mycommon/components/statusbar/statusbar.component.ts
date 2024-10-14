import { Component, Input, OnInit } from '@angular/core';
import { PageData } from 'src/interfaces/login-data.interface';
import { AuthorizationService } from 'src/services/authorization.service';
import { BackendPageService } from 'src/services/backendPage.service';
import { LoginService } from 'src/services/login.service';
import { ModalService } from 'src/services/modal.service';
import { PageService } from 'src/services/page.service';
import { MyUserService } from 'src/services/user.service';
import { MyRoutes } from '@ejfdelgado/ejflab-common/src/MyRoutes';

import { Auth, User } from '@angular/fire/auth';

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
export class StatusbarComponent implements OnInit {
  @Input('title')
  title: string | null;
  @Input('extraOptions')
  extraOptions: Array<OptionData> = [];
  @Input('saveState') saveState: string | null = null;
  user: User | null = null;

  constructor(
    private loginSrv: LoginService,
    private pageSrv: PageService,
    private authorizationSrv: AuthorizationService,
    private backendPageSrv: BackendPageService,
    private usrSrv: MyUserService,
    private modalSrv: ModalService,
    private auth: Auth
  ) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
  }

  ngOnInit(): void {}

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

  async goToHome() {}

  async logoutAndGoToHome() {
    await this.loginSrv.logout();
  }

  async editUser() {
    this.usrSrv.edit();
  }

  async logout() {
    this.loginSrv.logout();
  }

  async login() {
    this.loginSrv.login();
  }
}
