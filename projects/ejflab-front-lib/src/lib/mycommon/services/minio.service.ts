import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Buffer } from 'buffer';
const { encode } = require('@msgpack/msgpack');

@Injectable({
  providedIn: 'root',
})
export class MinioService {
  constructor(private httpService: HttpService) {}
  async getFileBytes(oneFile: File) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        const arrayBuffer: any = this.result;
        const array = new Uint8Array(arrayBuffer);
        resolve(array);
      };
      reader.readAsArrayBuffer(oneFile);
    });
  }
  async uploadFiles(
    bucketName: string,
    folderPath: string,
    files: Array<File> | FileList
  ) {
    const payload: any = [];
    //Remove / at begining and at end...
    folderPath = folderPath.replace(/^\s*[\\\/]/, '').replace(/[\\\/]\s*$/, '');
    for (let i = 0; i < files.length; i++) {
      const oneFile: File = files[i];
      const myBytes = await this.getFileBytes(oneFile);
      payload.push({
        bytes: myBytes,
        objectPath: `${folderPath}/${oneFile.name}`,
        metadata: {
          'Content-Type': oneFile.type,
        },
      });
    }
    const encoded = encode(payload);
    const buffer = Buffer.from(encoded);
    const binaryData = new Blob([buffer]);
    const response = await this.httpService.post<any>(
      `srv/minio/${bucketName}/write`,
      binaryData,
      {
        showIndicator: true,
        contentType: 'application/octet-stream',
      }
    );
    return response;
  }
}
