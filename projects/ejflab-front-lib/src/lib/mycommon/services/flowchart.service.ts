import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';
const { encode } = require('@msgpack/msgpack');
import { FlowChartRef } from '../components/base/context.component';

export interface FlowchartProcessRequestData {
  channel: string;
  room: string;
  processorMethod: string;
  namedInputs: { [key: string]: any };
  id?: string;
  data: { [key: string]: any };
}

export interface FlowchartProcessorDetailData {
  data: any;
}

export interface FlowchartGenericResponseData {
  status: string;
  message?: string;
  response?: FlowchartProcessorDetailData | any;
}

@Injectable({
  providedIn: 'root',
})
export class FlowchartService {
  constructor(private httpService: HttpService) {}

  async loadFlowchart(payload: FlowChartRef) {
    const response = await this.httpService.post<FlowchartGenericResponseData>(
      `srv/flowchart/load`,
      payload,
      {
        showIndicator: true,
      }
    );
    return response;
  }

  async process(
    payload: FlowchartProcessRequestData,
    rawJson: boolean = false
  ) {
    if (!payload.id) {
      payload.id = uuidv4().replace(/-/g, '_');
    }
    if (!payload.room) {
      payload.room = uuidv4().replace(/-/g, '_');
    }
    let response: any = null;
    if (rawJson == true) {
      response = await this.httpService.post<FlowchartGenericResponseData>(
        `srv/flowchart/processor_process_json`,
        payload,
        {
          showIndicator: true,
        }
      );
    } else {
      const encoded = encode(payload);
      const buffer = Buffer.from(encoded);
      const binaryData = new Blob([buffer]);
      response = await this.httpService.post<FlowchartGenericResponseData>(
        `srv/flowchart/processor_process`,
        binaryData,
        {
          showIndicator: true,
          contentType: 'application/octet-stream',
        }
      );
    }
    //console.log(JSON.stringify(response, null, 4));
    return response;
  }

  async introspect(payload: any) {
    const response = await this.httpService.post<FlowchartGenericResponseData>(
      `srv/flowchart/introspect`,
      payload,
      {
        showIndicator: false,
      }
    );
    return response;
  }
}
