import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  UserpopupComponent,
  UserPopUpData,
} from 'src/app/components/userpopup/userpopup.component';
import { HttpOptionsData } from 'src/interfaces/login-data.interface';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';
import { AuthService } from './auth.service';
import { HttpService, LoadFileData } from './http.service';
import { ModalService } from './modal.service';

export interface MyUserData {
  id?: string;
  created?: number;
  name: string;
  email: string | null;
  phone: string | null;
  picture?: string;
  updated?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  usuarioActual: MyUserData | null | undefined = undefined;
  eventoUsuario: EventEmitter<MyUserData> = new EventEmitter<MyUserData>();
  constructor(
    private auth: AuthService,
    private httpSrv: HttpService,
    private modalService: ModalService,
    private dialog: MatDialog
  ) {
    this.auth.getLoginEvent().subscribe((user) => {
      if (user != null) {
        if (MyUserService.isAnonymousPath()) {
          this.usuarioActual = null;
        } else {
          const consultaUsuario = this.httpSrv.get<MyUserData>('srv/usr/me', {
            showError: false,
          });
          consultaUsuario.then((usuario) => {
            if (usuario) {
              this.usuarioActual = usuario;
              this.eventoUsuario.emit(usuario);
            } else {
              this.usuarioActual = null;
            }
          });
        }
      } else {
        this.usuarioActual = null;
      }
    });
  }

  static isAnonymousPath() {
    const lista = MyConstants.ANONYMOUS_PATHS;
    const currentPath = location.pathname;
    for (let i = 0; i < lista.length; i++) {
      if (currentPath.endsWith(lista[i])) {
        return true;
      }
    }
    return false;
  }

  async getCurrentUser(): Promise<MyUserData | null> {
    if (this.usuarioActual !== undefined) {
      return JSON.parse(JSON.stringify(this.usuarioActual));
    } else {
      return new Promise((resolve) => {
        const subscripcion = this.eventoUsuario.subscribe((usuario) => {
          resolve(JSON.parse(JSON.stringify(usuario)));
          subscripcion.unsubscribe();
        });
      });
    }
  }

  async edit() {
    const usuario = await this.getCurrentUser();
    if (usuario) {
      const URL = 'srv/usr/me';
      const dialogRef = await this.dialog.open(UserpopupComponent, {
        data: usuario,
        panelClass: 'edit-user-dialog-container',
      });
      dialogRef
        .afterClosed()
        .subscribe(async (result: UserPopUpData | undefined) => {
          if (result && result.changed) {
            const options: HttpOptionsData = {
              showIndicator: true,
              showError: true,
            };
            try {
              let actualizado: any = null;
              if (result.newImage) {
                const fileOptions: LoadFileData = {
                  folder: MyConstants.USER.DEFAULT_FOLDER,
                  fileName: MyConstants.USER.DEFAULT_FILE,
                  foldertype: 'own',
                  sizebig: '512',
                  sizesmall: '128',
                };
                actualizado = await this.httpSrv.postWithFile(
                  result.newImage,
                  URL,
                  { datos: result.new },
                  options,
                  fileOptions
                );
              } else {
                actualizado = await this.httpSrv.post(
                  URL,
                  { datos: result.new },
                  options
                );
              }
              this.usuarioActual = actualizado;
              this.eventoUsuario.emit(actualizado);
              this.modalService.alert({
                title: 'Listo!',
                txt: 'Guardados tus datos.',
              });
            } catch (err) {}
          }
        });
    } else {
      this.modalService.alert({ txt: 'No hay usuario autenticado' });
    }
  }
}
