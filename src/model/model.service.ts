import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class ModelService implements OnModuleInit {
  private seasonalTypeModel: tf.GraphModel;
  private faceShapeModel: tf.LayersModel;
  // private MtcnnModel: tf.LayersModel;

  async onModuleInit() {
    let modelPath;
    let handler;

    // modelPath = process.env.MODEL_URL_SEASONAL;
    // handler = tf.io.fileSystem(modelPath);
    // this.seasonalTypeModel = await tf.loadGraphModel(handler);

    // modelPath = process.env.MODEL_URL_FACE;
    // handler = tf.io.fileSystem(modelPath);
    // this.faceShapeModel = await tf.loadLayersModel(handler);

    // modelPath = process.env.MODEL_URL_MTCNN;
    // handler = tf.io.fileSystem(modelPath);
    // this.MtcnnModel = await tf.loadLayersModel(handler);

    // ! uncomment line below when loading the model by url
    this.seasonalTypeModel = await tf.loadGraphModel(process.env.MODEL_URL_SEASONAL);
    this.faceShapeModel = await tf.loadLayersModel(process.env.MODEL_URL_FACE);
    // this.Mtcnn = await tf.loadGraphModel(process.env.MODEL_URL_MTCNN);
  }

  getSeasonalModel(): tf.GraphModel {
    return this.seasonalTypeModel;
  }
  getCollarModel(): tf.LayersModel {
    return this.faceShapeModel;
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

  async predictfaceShape(model: tf.LayersModel, image: Express.Multer.File) {
    try {
      const tensor = tf.node
        .decodeImage(image.buffer)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      const classes = ['Heart', 'Oblong', 'Oval', 'Round', 'Square'];

      const prediction = model.predict(tensor) as tf.Tensor;
      const score = await prediction.data();
      const faceShapeConfidenceScore = Math.max(...score) * 100;

      const classResult = tf.argMax(prediction, 1).dataSync()[0];
      const faceShape = classes[classResult];
      return { faceShapeConfidenceScore, faceShape };
    } catch (error) {
      return error;
    }
  }

  async predictMtcnn(model: tf.LayersModel, image: Express.Multer.File) {
    try {
      const tensor = tf.node
        .decodeImage(image.buffer)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      const prediction = model.predict(tensor) as tf.Tensor;
      const predictionArray = await prediction.array();
      if (predictionArray instanceof Array) {
        return predictionArray.map((pred) => pred.box);
      }
      return predictionArray;
    } catch (error) {
      return error;
    }
  }
}
