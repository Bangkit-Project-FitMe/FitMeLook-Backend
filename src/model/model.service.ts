import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class ModelService implements OnModuleInit {
  private seasonalTypeModel: tf.GraphModel;
  private faceShapeModel: tf.LayersModel;

  async onModuleInit() {
    let modelPath;
    let handler;

    // ! Console.log loading models needs to be streamlined, reduce usage of console.log
    // ! When in production fix it first
    console.log('Loading models...');

    console.log('Loading model 1... (seasonal)');
    modelPath = process.env.MODEL_URL_SEASONAL;
    handler = tf.io.fileSystem(modelPath);
    this.seasonalTypeModel = await tf.loadGraphModel(handler);

    console.log('Loading model 2... (face_shape)');
    modelPath = process.env.MODEL_URL_FACE;
    handler = tf.io.fileSystem(modelPath);
    // ! Delete in production
    // console.log('sampai sini');
    this.faceShapeModel = await tf.loadLayersModel(handler);

    // this.model = await tf.loadGraphModel(process.env.MODEL_URL);
    console.log('Model is successfully loaded');
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
}
