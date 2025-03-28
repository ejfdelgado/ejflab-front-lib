import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from '../../services/modal.service';
import { MyUserData, MyUserOptionsData } from '../../services/user.service';
import { ImagepickerOptionsData } from '../imagepicker/imagepicker.component';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';
import { FileBase64Data } from '../base/base.component';

export interface UserPopUpData {
  newImage?: string;
  changed: boolean;
  old: MyUserData;
  new: MyUserData;
}

@Component({
  selector: 'app-userpopup',
  templateUrl: './userpopup.component.html',
  styleUrls: ['./userpopup.component.css'],
})
export class UserpopupComponent implements OnInit {
  form: FormGroup;
  options: MyUserOptionsData = {
    editPhone: true,
    editEmail: true,
    editName: true,
  };
  imageOptions: ImagepickerOptionsData = {
    isEditable: true,
    isRounded: true,
    useBackground: false,
    defaultImage: MyConstants.USER.DEFAULT_IMAGE,
  };
  ahora = new Date().getTime();
  respuesta: UserPopUpData;
  constructor(
    private dialogRef: MatDialogRef<UserpopupComponent>,
    private fb: FormBuilder,
    private modalSrv: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: MyUserData
  ) {
    if (data.options) {
      this.options = data.options;
    }
    this.respuesta = {
      old: data,
      changed: false,
      new: {
        name: data.name,
        email: data.email, // No se debe poder cambiar si es el id...
        phone: data.phone,
      },
    };
  }

  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get phone() {
    return this.form.get('phone');
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
    this.form = this.fb.group({});

    if (this.options.editName) {
      this.form.addControl("name", this.fb.control(this.data.name, [Validators.required, Validators.maxLength(512)]));
    }
    if (this.options.editEmail) {
      this.form.addControl("email", this.fb.control(this.data.email, [Validators.maxLength(512)]));
    }
    if (this.options.editPhone) {
      this.form.addControl("phone", this.fb.control(this.data.phone, [Validators.maxLength(512)]));
    }
  }

  getMaxLengthMessage(label: string, error: any | null): string {
    if (error && error.maxlength) {
      return `Máximo ${error.maxlength.requiredLength} letras. Actualmente hay ${error.maxlength.actualLength}.`;
    }
    return '';
  }

  changedImage(imagenBase64: FileBase64Data) {
    if (imagenBase64.base64) {
      this.respuesta.newImage = imagenBase64.base64;
    }
  }

  getImage(): string | null {
    if (typeof this.data.picture == 'string' && this.data.picture.length > 0) {
      return this.data.picture + `?t=${this.ahora}`;
    }
    return null;
  }

  async guardar() {
    if (this.form.valid) {
      // Si ha cambiado la imagen
      if (typeof this.respuesta.newImage == 'string') {
        this.respuesta.changed = true;
      }

      const llaves = [];
      if (this.options.editName) {
        this.respuesta.new.name = this.form.value.name;
        llaves.push("name");
      }
      if (this.options.editEmail) {
        this.respuesta.new.email = this.form.value.email;
        llaves.push("email");
      }
      if (this.options.editPhone) {
        this.respuesta.new.phone = this.form.value.phone;
        llaves.push("phone");
      }

      this.respuesta.new.picture = this.respuesta.old.picture;
      this.respuesta.new.created = this.respuesta.old.created;

      // o si alguno de los campos ha cambiado
      if (!this.respuesta.changed) {
        for (let i = 0; i < llaves.length; i++) {
          const llave = llaves[i];
          const nuevo: any = this.respuesta.new;
          const viejo: any = this.respuesta.old;
          if (nuevo[llave] != viejo[llave]) {
            this.respuesta.changed = true;
          }
        }
      }
      this.dialogRef.close(this.respuesta);
    } else {
      this.modalSrv.alert({
        title: 'Ups...',
        txt: 'Verifica tus datos antes de continuar.',
      });
    }
  }
}
