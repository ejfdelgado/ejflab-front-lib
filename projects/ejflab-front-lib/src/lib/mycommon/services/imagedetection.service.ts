import { Injectable } from '@angular/core';
import { MyConstants } from '@ejfdelgado/ejflab-common/src/MyConstants';
import * as tf from '@tensorflow/tfjs';
import { Buffer } from 'buffer';
import { IndicatorService } from './indicator.service';
import { ModalService } from './modal.service';
import { MycommonModule } from '../mycommon.module';

export interface ImageDetectionData {
  boxes_data: Array<number>;
  scores_data: Array<number>;
  classes_data: Array<number>;
  ratios: Array<number>;
}

export interface ImageSimpleDetData {
  tag: number;
  minX: number;
  minY: number;
  width: number;
  height: number;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImagedetectionService {
  modelMaps: { [key: string]: any } = {};
  constructor(
    private indicatorSrv: IndicatorService,
    private modalSrv: ModalService
  ) {}

  async detect(
    modelId: string,
    source: any,
    numClass: number,
    showBussy: boolean = false,
    showErrors: boolean = false
  ): Promise<Array<ImageSimpleDetData> | null> {
    let response = null;
    let indicador = null;
    if (showBussy) {
      indicador = this.indicatorSrv.start();
    }
    try {
      const modelUrl = this.completeImagePath(
        Buffer.from(modelId, 'base64').toString('utf8')
      );

      let localModel = this.modelMaps[modelUrl];

      if (!localModel) {
        localModel = await this.prepareModel(modelUrl);
        this.modelMaps[modelUrl] = localModel;
      }

      response = await this.processInputSource(source, localModel, numClass);
    } catch (err: any) {
      if (showErrors) {
        this.modalSrv.error(err);
      } else {
        console.log(err);
      }
    }
    if (indicador) {
      indicador.done();
    }
    return response;
  }

  async processInputSource(
    source: any,
    localModel: any,
    numClass: any
  ): Promise<Array<ImageSimpleDetData> | null> {
    const inputs: any = localModel.inputs;
    if (inputs) {
      const inputShape = localModel.inputs[0].shape;
      const [modelWidth, modelHeight] = inputShape.slice(1, 3); // get model width and height

      const [input, xRatio, yRatio] = this.preprocess(
        source,
        modelWidth,
        modelHeight
      );
      const res: any = localModel.execute(input); // inference model

      const transRes = res.transpose([0, 2, 1]); // transpose result [b, det, n] => [b, n, det]
      const boxes: any = tf.tidy(() => {
        const w = transRes.slice([0, 0, 2], [-1, -1, 1]); // get width
        const h = transRes.slice([0, 0, 3], [-1, -1, 1]); // get height
        const x1 = tf.sub(transRes.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2)); // x1
        const y1 = tf.sub(transRes.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2)); // y1
        return tf
          .concat(
            [
              y1,
              x1,
              tf.add(y1, h), //y2
              tf.add(x1, w), //x2
            ],
            2
          )
          .squeeze();
      }); // process boxes [y1, x1, y2, x2]

      const [scores, classes] = tf.tidy(() => {
        // class scores
        const rawScores = transRes
          .slice([0, 0, 4], [-1, -1, numClass])
          .squeeze(0); // #6 only squeeze axis 0 to handle only 1 class models
        return [rawScores.max(1), rawScores.argMax(1)];
      }); // get max scores and classes index

      const nms = await tf.image.nonMaxSuppressionAsync(
        boxes,
        scores,
        500,
        0.45,
        0.2
      ); // NMS to filter boxes

      const boxes_data = this.mapToArray(boxes.gather(nms, 0).dataSync()); // indexing boxes by nms index
      const scores_data = this.mapToArray(scores.gather(nms, 0).dataSync()); // indexing scores by nms index
      const classes_data = this.mapToArray(classes.gather(nms, 0).dataSync()); // indexing classes by nms index
      tf.dispose([res, transRes, boxes, scores, classes, nms]); // clear memory
      const response = {
        boxes_data,
        scores_data,
        classes_data,
        ratios: [xRatio, yRatio],
      };
      const detecciones: Array<ImageSimpleDetData> = [];
      this.processDetectedData(
        response,
        modelWidth,
        modelHeight,
        (
          currentLabel: number,
          minX: number,
          minY: number,
          width: number,
          height: number,
          score: number
        ) => {
          detecciones.push({
            tag: currentLabel,
            minX,
            minY,
            width,
            height,
            score,
          });
        }
      );

      return detecciones;
    }
    return null;
  }

  processDetectedData(
    data: ImageDetectionData,
    widthP: number,
    heightP: number,
    callback: Function
  ) {
    const scores_data = data.scores_data;
    const boxes_data = data.boxes_data;
    const ratios = data.ratios;
    const classes_data = data.classes_data;

    for (let i = 0; i < scores_data.length; ++i) {
      const currentLabel = classes_data[i];
      let [y1, x1, y2, x2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= ratios[0];
      x2 *= ratios[0];
      y1 *= ratios[1];
      y2 *= ratios[1];
      const width = x2 - x1;
      const height = y2 - y1;
      callback(
        currentLabel,
        x1 / widthP,
        y1 / heightP,
        width / widthP,
        height / heightP,
        scores_data[i]
      );
    }
  }

  mapToArray(mapa: any) {
    const llaves = Object.keys(mapa);
    const ans = [];
    for (let i = 0; i < llaves.length; i++) {
      const llaveStr = llaves[i];
      const llaveInt = parseInt(llaveStr);
      ans[llaveInt] = mapa[llaveStr];
    }
    return ans;
  }

  preprocess(source: any, modelWidth: any, modelHeight: any) {
    let xRatio, yRatio; // ratios for boxes

    const input = tf.tidy(() => {
      const img = tf.browser.fromPixels(source);

      // padding image to square => [n, m] to [n, n], n > m
      const [h, w] = img.shape.slice(0, 2); // get source width and height
      const maxSize = Math.max(w, h); // get max size
      const imgPadded: any = img.pad([
        [0, maxSize - h], // padding y [bottom only]
        [0, maxSize - w], // padding x [right only]
        [0, 0],
      ]);

      xRatio = maxSize / w; // update xRatio
      yRatio = maxSize / h; // update yRatio

      return tf.image
        .resizeBilinear(imgPadded, [modelWidth, modelHeight]) // resize frame
        .div(255.0) // normalize
        .expandDims(0); // add batch
    });

    return [input, xRatio, yRatio];
  }

  async prepareModel(model: string) {
    const modelInstance = await tf.loadGraphModel(model);
    return modelInstance;
  }

  completeImagePath(path: string, suffix = '/best_web_model/model.json') {
    // Convert to tflite
    const replaced = path.replace(/\/best\.pt/, suffix);
    return MyConstants.SRV_ROOT + replaced + '?authcookie=1&max_age=604800';
  }
}
