import { Injectable } from '@angular/core';
import { SoundRecord } from 'src/app/views/audia/audia.component';
import { HttpService } from './http.service';
import {
  JobDataQuery,
  JobsDataArray,
  TryStartJobData,
} from './imagiation.service';

export interface ClassDataResponse {
  status: string;
  classes: Array<ClassData>;
}

export interface ClassData {
  label: string;
}

export interface AudiaData {
  status: string;
  audio: SoundRecord | Array<SoundRecord>;
}

export interface AudiaDataArray {
  status: string;
  audios: Array<SoundRecord>;
}

export interface AudiaDataQuery {
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
export class AudiaService {
  constructor(private httpService: HttpService) {}

  inferPageId(audio: SoundRecord | Array<SoundRecord>) {
    let pageId = null;
    if (audio instanceof Array) {
      if (audio.length == 0) {
        return null;
      }
      pageId = audio[0].pg;
    } else {
      pageId = audio.pg;
    }
    return pageId;
  }

  async saveAudio(audio: SoundRecord | Array<SoundRecord>): Promise<AudiaData> {
    const payload = {
      audio,
    };
    const pageId = this.inferPageId(audio);
    if (pageId == null) {
      return {
        status: 'ok',
        audio: [],
      };
    }
    const response = await this.httpService.post<AudiaData>(
      `srv/audia/${pageId}/audiosw`,
      payload,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo guardar el audio');
    }
    return response;
  }

  async deleteAudio(
    audio: SoundRecord | Array<SoundRecord>
  ): Promise<AudiaData> {
    const pageId = this.inferPageId(audio);
    if (pageId == null) {
      return {
        status: 'ok',
        audio: [],
      };
    }
    const payload = {
      audio,
    };
    const response = await this.httpService.post<AudiaData>(
      `srv/audia/${pageId}/audiosd`,
      payload,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer los audios');
    }
    return response;
  }

  async pageAudios(
    pageId: string,
    query: AudiaDataQuery
  ): Promise<AudiaDataArray> {
    const response = await this.httpService.post<AudiaDataArray>(
      `srv/audia/${pageId}/audiosr`,
      query,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer los audios');
    }
    return response;
  }

  async characterizeVoice(sound: SoundRecord): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/audia/${sound.pg}/characterizevoice`,
      {
        sound,
      },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo caracterizar el audio');
    }
    return response;
  }

  async tagsRead(pageId: string): Promise<Array<ClassData>> {
    const response = await this.httpService.post<ClassDataResponse>(
      `srv/audia/${pageId}/tagsr`,
      {},
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer las clases');
    }
    return response.classes;
  }

  async tagsWrite(pageId: string, classes: Array<ClassData>): Promise<void> {
    const response = await this.httpService.post<void>(
      `srv/audia/${pageId}/tagsw`,
      { classes },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron escribir las clases');
    }
    return response;
  }
}
