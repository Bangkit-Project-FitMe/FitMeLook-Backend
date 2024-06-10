import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ModelService } from 'src/model/model.service';

@Injectable()
export class UsersService {
  private firestore: admin.firestore.Firestore;

  constructor(
    @Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App,
    private readonly modelService: ModelService,
  ) {
    this.firestore = firebaseAdmin.firestore();
  }

  async postPredictImage(image: Express.Multer.File) {
    const seasonalModel = this.modelService.getSeasonalModel();
    const faceShapeModel = this.modelService.getCollarModel();

    if (!seasonalModel || !faceShapeModel) {
      throw new Error('Model is not loaded');
    }

    const { seasonalTypeConfidenceScore, seasonalType } =
      await this.modelService.predictSeasonalType(seasonalModel, image);
    const { faceShapeConfidenceScore, faceShape } =
      await this.modelService.predictfaceShape(faceShapeModel, image);

    return {
      seasonalTypeConfidenceScore,
      seasonalType,
      faceShapeConfidenceScore,
      faceShape,
    };
  }
  // ! Does it still in use? if not delete in production
  getHistories(userId: string) {
    return {
      userId: userId,
    };
  }

  // ! This too delete if not used
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
