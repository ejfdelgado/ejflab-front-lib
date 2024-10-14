import { Injectable } from '@angular/core';
import { ImageShoot } from 'src/app/views/mfa/mfa.component';
import { HttpService } from './http.service';

export interface MfaData {
  status: string;
  image: ImageShoot | Array<ImageShoot>;
}

export interface MfaDataArray {
  status: string;
  images: Array<ImageShoot>;
}

export interface MfaDataQuery {
  offset: number;
  min_offset: number;
  max: number;
  max_date: number;
  min_date: number;
  max_count: number;
}

@Injectable({
  providedIn: 'root',
})
export class MfaService {
  constructor(private httpService: HttpService) {}

  inferPageId(image: ImageShoot | Array<ImageShoot>) {
    let pageId = null;
    if (image instanceof Array) {
      if (image.length == 0) {
        return null;
      }
      pageId = image[0].pg;
    } else {
      pageId = image.pg;
    }
    return pageId;
  }

  async savePhoto(image: ImageShoot | Array<ImageShoot>): Promise<MfaData> {
    const payload = {
      image,
    };
    const pageId = this.inferPageId(image);
    if (pageId == null) {
      return {
        status: 'ok',
        image: [],
      };
    }
    const response = await this.httpService.post<MfaData>(
      `srv/mfa/${pageId}/imagesw`,
      payload,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo guardar la foto');
    }
    return response;
  }

  async deletePhotos(image: ImageShoot | Array<ImageShoot>): Promise<MfaData> {
    const pageId = this.inferPageId(image);
    if (pageId == null) {
      return {
        status: 'ok',
        image: [],
      };
    }
    const payload = {
      image,
    };
    const response = await this.httpService.post<MfaData>(
      `srv/mfa/${pageId}/imagesd`,
      payload,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer las fotos');
    }
    return response;
  }

  async pagePhotos(pageId: string, query: MfaDataQuery): Promise<MfaDataArray> {
    const response = await this.httpService.post<MfaDataArray>(
      `srv/mfa/${pageId}/imagesr`,
      query,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer las fotos');
    }
    return response;
  }

  async computeVector(pageId: string, imageId: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/mfa/${pageId}/computevector`,
      { imgid: imageId },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron calcular la caracterización del rostro');
    }
    return response;
  }

  async rotate(pageId: string, imageId: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/mfa/${pageId}/rotate`,
      { imgid: imageId },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo rotar el uid');
    }
    return response;
  }

  async validateuid(pageId: string, uid: string, imgid: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/mfa/${pageId}/validateuid`,
      { uid, imgid },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo verificar el uid');
    }
    return response;
  }

  async validateFace(
    pageId: string,
    base64: string,
    searchtype: string,
    value: string
  ): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/mfa/${pageId}/validateface`,
      { base64, searchtype, value },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo validar el rostro');
    }
    return response;
  }

  async createUpdateEnrollmentLink(
    pageId: string,
    imgid: string
  ): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/mfa/${pageId}/createenrollment`,
      { imgid, origin: location.origin },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo enviar el correo de enrolamiento');
    }
    return response;
  }

  async updatePassWithEnrollmentId(imgid: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/mfa/executeenrollment`,
      { imgid },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo hacer el enrolamiento');
    }
    return response;
  }
}
