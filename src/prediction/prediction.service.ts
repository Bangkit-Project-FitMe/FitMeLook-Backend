import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PredictionService {
  private firestore: admin.firestore.Firestore;

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {
    this.firestore = this.firebaseAdmin.firestore();
  }

  async getUserAllPredictions(userID: string): Promise<any> {
    try {
      const snapshot = await this.firestore
        .collection('users')
        .doc(userID)
        .collection('predictions')
        .get();
      if (snapshot.empty) {
        return {
          status: 'fail',
          message: 'No prediction records found for this user.',
          data: {},
        };
      }
      const predictions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        status: 'success',
        message: 'User predictions retrieved successfully.',
        data: predictions,
      };
    } catch (error) {
      console.error('Error getting user predictions:', error);
      return {
        status: 'fail',
        message: `An error occurred while retrieving user predictions: ${error.message}.`,
        data: {},
      };
    }
  }

  async getPredictionByID(userID: string, predictionID: string): Promise<any> {
    try {
      const doc = await this.firestore
        .collection('users')
        .doc(userID)
        .collection('predictions')
        .doc(predictionID)
        .get();
      if (!doc.exists) {
        return {
          status: 'fail',
          message: 'The specified prediction ID does not exist.',
          data: {},
        };
      }

      return {
        status: 'success',
        message: 'Prediction details retrieved successfully.',
        data: {
          predictionID: doc.id,
          ...doc.data(),
        },
      };
    } catch (error) {
      console.error('Error getting prediction by ID:', error);
      return {
        status: 'fail',
        message: `An error occurred while retrieving the prediction: ${error.message}.`,
        data: {},
      };
    }
  }
}
