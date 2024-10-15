import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalService } from 'src/services/modal.service';
import { Inject } from '@angular/core';
import { PayuService, SecretsWriteData } from 'src/services/payu.service';

export interface PayuConfigData {
  payu_api_key: string;
  payu_api_login: string;
  payu_pub_key: string;
  payu_merchant_id: string;
  payu_account_id: string;
}

@Component({
  selector: 'app-payupopup',
  templateUrl: './payupopup.component.html',
  styleUrls: ['./payupopup.component.css'],
})
export class PayupopupComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PayupopupComponent>,
    private fb: FormBuilder,
    private modalSrv: ModalService,
    private payuSrv: PayuService,
    @Inject(MAT_DIALOG_DATA) public data: PayuConfigData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      payu_api_key: [this.data.payu_api_key, [Validators.required]],
      payu_api_login: [this.data.payu_api_login, [Validators.required]],
      payu_pub_key: [this.data.payu_pub_key, [Validators.required]],
      payu_account_id: [this.data.payu_account_id, [Validators.required]],
      payu_merchant_id: [this.data.payu_merchant_id, [Validators.required]],
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  get payu_api_key() {
    return this.form.get('payu_api_key');
  }

  get payu_api_login() {
    return this.form.get('payu_api_login');
  }

  get payu_pub_key() {
    return this.form.get('payu_pub_key');
  }

  get payu_account_id() {
    return this.form.get('payu_account_id');
  }

  get payu_merchant_id() {
    return this.form.get('payu_merchant_id');
  }

  async guardar() {
    const valores: SecretsWriteData = {
      payu_api_key: this.form.value.payu_api_key,
      payu_api_login: this.form.value.payu_api_login,
      payu_pub_key: this.form.value.payu_pub_key,
      payu_account_id: this.form.value.payu_account_id,
      payu_merchant_id: this.form.value.payu_merchant_id,
    };
    if (this.form.valid) {
      // Se envia a guardar al servicio
      await this.payuSrv.saveSecrets(valores);
      this.dialogRef.close(valores);
    } else {
      this.modalSrv.alert({
        title: 'Ups...',
        txt: 'Verifica tus datos antes de continuar.',
      });
    }
  }
}
