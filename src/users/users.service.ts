import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class UsersService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  async postPredictImage(model: tf.GraphModel, image: Express.Multer.File) {
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

  getHistories(userId: string) {
    return {
      userId: userId,
    };
  }

  getSpecificHistories(userId: string, predictionId: string) {
    return {
      userId: userId,
      predictionId: predictionId,
    };
  }

  async getUserData(userId: string) {
    const snapshot = await this.firestore.collection('users').doc(userId).get();
    const fetchedData = snapshot.data();

    if (fetchedData) {
      return {
        status: 'success',
        message: `Successfully GET ${userId} data.`,
        data: {
          user_id: userId,
          ...fetchedData.profiles,
        },
      };
    }

    return {
      status: 'fail',
      message: 'Request failed: User ID not found.',
      data: {},
    };
  }

  patchUserData(userId: string) {
    return {
      userId: userId,
    };
  }
}
