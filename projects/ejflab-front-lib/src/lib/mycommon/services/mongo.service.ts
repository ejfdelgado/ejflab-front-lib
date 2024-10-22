import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MycommonModule } from '../mycommon.module';

export interface MongoWriteData {
  database: string;
  collection: string;
  payload: any;
}

export interface MongoWhereData {
  key: string;
  oper: string;
  value: any;
}

export interface MongoReadData {
  database: string;
  where: string;
}

export interface MongoUpdateData {
  database: string;
  where: string;
  update: any;
}

@Injectable({
  providedIn: 'root',
})
export class MongoService {
  constructor(private httpService: HttpService) {}
  async write(data: MongoWriteData): Promise<any> {
    const response = await this.httpService.post<MongoWriteData>(
      `srv/mongo/${data.database}/${data.collection}/write`,
      data.payload,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error("Can't write");
    }
    return response;
  }

  async read(data: MongoReadData): Promise<any> {
    const response = await this.httpService.post<MongoReadData>(
      `srv/mongo/${data.database}/read`,
      {
        where: data.where,
      },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error("Can't write");
    }
    return response;
  }

  async delete(data: MongoReadData): Promise<any> {
    const response = await this.httpService.post<MongoReadData>(
      `srv/mongo/${data.database}/delete`,
      {
        where: data.where,
      },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error("Can't delete");
    }
    return response;
  }

  async update(data: MongoUpdateData): Promise<any> {
    const response = await this.httpService.post<MongoUpdateData>(
      `srv/mongo/${data.database}/update`,
      {
        where: data.where,
        update: data.update,
      },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error("Can't update");
    }
    return response;
  }
}
