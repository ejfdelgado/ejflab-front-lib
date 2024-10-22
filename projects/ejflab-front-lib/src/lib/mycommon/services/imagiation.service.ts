import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MycommonModule } from '../mycommon.module';

export enum JobWorker {
  local = 'local',
  predefined = 'predefined',
  paid1 = 'paid1',
}

export enum JobState {
  pending = 'pending',
  running = 'running',
  done = 'done',
  fail = 'fail',
  abort = 'abort',
}

export interface TrainingJob extends ImagiationDataQuery {
  id?: string;
  pg?: string;
  created?: number;
  updated?: number;
  started?: number;
  ended?: number;
  hours?: number;
  state?: JobState;
  progress?: number;
  owner?: string;
  workerType?: JobWorker;
  pageType: string;
  // Yolo
  parentModel?: string;
  epochs: number;
  imageSize: number;
  // Outputs
  log?: string;
  numImages?: number;
  numTags?: number;
}

export interface ImageShoot {
  id?: string;
  created?: number;
  updated?: number;
  tags: Array<Array<number>>;
  author?: string;
  pg: string;
  urlBig: string;
  urlThumbnail: string;
  tagCount: number;
  tagList: Array<number>;
}

export interface PlayDetectionData {
  id?: string;
  pg?: string;
  created?: number;
  name: string;
  modelId: string;
  numClasses: number;
  delayMillis: number;
  facingMode: string;
  configs: Array<any>;
  lat: number;
  lon: number;
}

export interface ImagiationData {
  status: string;
  image: ImageShoot | Array<ImageShoot>;
}

export interface ImagiationDataArray {
  status: string;
  images: Array<ImageShoot>;
}

export interface JobsDataArray {
  status: string;
  jobs: Array<TrainingJob>;
}

export interface TheTagData {
  [key: string]: {
    txt: string;
    ref?: string | null;
  };
}

export interface TagsData {
  status: string;
  tag: TheTagData;
}

export interface ImagiationDataQuery {
  offset: number;
  min_offset: number;
  max: number;
  max_date: number;
  min_date: number;
  max_count: number;
}

export interface JobDataQuery {
  offset: number;
  max: number;
}

export interface TryStartJobData {
  status: string;
  response?: {
    status: string;
    instanceId?: string;
    currentJobs?: number;
    maxJobs?: number;
  };
}

export interface WatchServerData {
  status: string;
  response: {
    status: string;
    instanceId: string;
    currentJobs: number;
    maxJobs: number;
  };
}

export interface StatValsData {
  count: number;
}

export interface StatisticData {
  founds: { [key: string]: StatValsData };
  confId: string;
  confName: string;
  big: string;
  t: number;
  thumb: string;
  pg: string;
  lon: number;
  lat: number;
  id: string;
}

export interface StatisticResponseData {
  status: string;
  images: Array<any>;
}

@Injectable({
  providedIn: 'root',
})
export class ImageiationService {
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

  async savePhoto(
    image: ImageShoot | Array<ImageShoot>
  ): Promise<ImagiationData> {
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
    const response = await this.httpService.post<ImagiationData>(
      `srv/imagiation/${pageId}/imagesw`,
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

  async deletePhotos(
    image: ImageShoot | Array<ImageShoot>
  ): Promise<ImagiationData> {
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
    const response = await this.httpService.post<ImagiationData>(
      `srv/imagiation/${pageId}/imagesd`,
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

  async pagePhotos(
    pageId: string,
    query: ImagiationDataQuery
  ): Promise<ImagiationDataArray> {
    const response = await this.httpService.post<ImagiationDataArray>(
      `srv/imagiation/${pageId}/imagesr`,
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

  async tagsRead(pageId: string): Promise<TagsData> {
    const response = await this.httpService.post<TagsData>(
      `srv/imagiation/${pageId}/tagsr`,
      {},
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer los tags');
    }
    return response;
  }

  async tagsWrite(pageId: string, tag: TheTagData): Promise<TagsData> {
    const response = await this.httpService.post<TagsData>(
      `srv/imagiation/${pageId}/tagsw`,
      { tag },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron escribir los tags');
    }
    return response;
  }

  async pageJobs(pageId: string, query: JobDataQuery): Promise<JobsDataArray> {
    const response = await this.httpService.post<JobsDataArray>(
      `srv/imagiation/${pageId}/jobsr`,
      query,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer las tareas programadas');
    }
    return response;
  }

  async saveJob(
    pageType: string,
    pageId: string,
    job: TrainingJob
  ): Promise<JobsDataArray> {
    const response = await this.httpService.post<JobsDataArray>(
      `srv/${pageType}/${pageId}/jobsw`,
      { job },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo escribir la tarea programada');
    }
    return response;
  }

  async tryStartJob(pageId: string, jobId: string): Promise<TryStartJobData> {
    const response = await this.httpService.post<TryStartJobData>(
      `srv/imagiation/${pageId}/startjob`,
      { jobId },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo intentar ejecutar el entrenamiento');
    }
    return response;
  }

  async readJob(pageId: string, jobId: string): Promise<JobsDataArray> {
    const response = await this.httpService.post<JobsDataArray>(
      `srv/imagiation/${pageId}/jobr`,
      { jobId },
      {
        showIndicator: false,
      }
    );
    if (response == null) {
      throw Error('No se pudo leer el detalle');
    }
    return response;
  }

  async watchServer(): Promise<WatchServerData> {
    const response = await this.httpService.post<WatchServerData>(
      `srv/imagiation/watch`,
      {},
      {
        showIndicator: false,
      }
    );
    if (response == null) {
      throw Error('No se pudo leer el estado del servidor');
    }
    return response;
  }

  async saveConfig(
    pageType: string,
    pageId: string,
    conf: PlayDetectionData
  ): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/${pageType}/${pageId}/confsw`,
      { conf },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo escribir la configuración');
    }
    return response;
  }

  async deleteConfig(pageId: string, conf: PlayDetectionData): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/${pageId}/confsd`,
      { confId: conf.id },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo borrar la configuración');
    }
    return response;
  }

  async readConfig(pageId: string, confId: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/${pageId}/confsr`,
      { confId: confId },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo leer la configuración');
    }
    return response;
  }

  async pageConf(
    pageId: string,
    query: JobDataQuery
  ): Promise<Array<PlayDetectionData>> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/${pageId}/confsp`,
      query,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer las configuraciones');
    }
    return response.confs;
  }

  async storeStatistic(pageId: string, data: any): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/${pageId}/statistic`,
      data,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo crear la estadística');
    }
    return response;
  }

  async pageStatistics(
    pageId: string,
    query: ImagiationDataQuery
  ): Promise<StatisticResponseData> {
    const response = await this.httpService.post<StatisticResponseData>(
      `srv/imagiation/${pageId}/statisticsr`,
      query,
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudieron leer las estadísticas');
    }
    return response;
  }

  async deleteStatistic(pageId: string, statId: string): Promise<any> {
    const response = await this.httpService.post<any>(
      `srv/imagiation/${pageId}/statisticd`,
      { statId },
      {
        showIndicator: true,
      }
    );
    if (response == null) {
      throw Error('No se pudo borrar la estadística');
    }
    return response;
  }
}
