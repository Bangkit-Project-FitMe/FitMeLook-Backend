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
    const collarModel = this.modelService.getCollarModel();

    if (!seasonalModel || !collarModel) {
      throw new Error('Model is not loaded');
    }

    const { seasonalTypeConfidenceScore, seasonalType } =
      await this.modelService.predictSeasonalType(seasonalModel, image);
    const { collarTypeConfidenceScore, collarType } =
      await this.modelService.predictCollarType(collarModel, image);

    return {
      seasonalTypeConfidenceScore,
      seasonalType,
      collarTypeConfidenceScore,
      collarType,
    };
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
