import { Injectable, OnModuleInit } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class ModelService implements OnModuleInit {
  private model: tf.GraphModel;

  async onModuleInit() {
    console.log('Loading model...');
    this.model = await tf.loadGraphModel(process.env.MODEL_URL);
    console.log('Model is successfully loaded');
  }

  getModel(): tf.GraphModel {
    return this.model;
  }
}
