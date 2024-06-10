import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class ModelService implements OnModuleInit {
  private seasonalTypeModel: tf.GraphModel;
  private collarTypeModel: tf.LayersModel;

  async onModuleInit() {
    let modelPath;
    let handler;
    console.log('Loading models...');

    console.log('Loading model 1... (seasonal)');
    modelPath = process.env.MODEL_URL_SEASONAL;
    handler = tf.io.fileSystem(modelPath);
    this.seasonalTypeModel = await tf.loadGraphModel(handler);

    console.log('Loading model 2... (collar)');
    modelPath = process.env.MODEL_URL_COLLAR;
    handler = tf.io.fileSystem(modelPath);
    console.log('sampai sini');
    this.collarTypeModel = await tf.loadLayersModel(handler);

    // this.model = await tf.loadGraphModel(process.env.MODEL_URL);
    console.log('Model is successfully loaded');
  }

  getSeasonalModel(): tf.GraphModel {
    return this.seasonalTypeModel;
  }
  getCollarModel(): tf.LayersModel {
    return this.collarTypeModel;
  }

  async predictSeasonalType(model: tf.GraphModel, image: Express.Multer.File) {
    try {
      const tensor = tf.node
        .decodeImage(image.buffer)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      const classes = ['Autumn', 'Spring', 'Summer', 'Winter'];

      const prediction = model.predict(tensor) as tf.Tensor;
      const score = await prediction.data();
      const seasonalTypeConfidenceScore = Math.max(...score) * 100;

      const classResult = tf.argMax(prediction, 1).dataSync()[0];
      const seasonalType = classes[classResult];
      return { seasonalTypeConfidenceScore, seasonalType };
    } catch (error) {
      return error;
    }
  }

  async predictCollarType(model: tf.LayersModel, image: Express.Multer.File) {
    try {
      const tensor = tf.node
        .decodeImage(image.buffer)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      const classes = ['Heart', 'Oblong', 'Oval', 'Round', 'Square'];

      const prediction = model.predict(tensor) as tf.Tensor;
      const score = await prediction.data();
      const collarTypeConfidenceScore = Math.max(...score) * 100;

      const classResult = tf.argMax(prediction, 1).dataSync()[0];
      const collarType = classes[classResult];
      return { collarTypeConfidenceScore, collarType };
    } catch (error) {
      return error;
    }
  }
}
