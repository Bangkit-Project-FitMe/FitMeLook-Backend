import { Injectable } from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class UsersService {
  postPredictImage(model: tf.GraphModel, image: Express.Multer.File) {
    return {
      model: model,
      image: image,
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

  getUserData(userId: string) {
    return {
      userId: userId,
    };
  }

  patchUserData(userId: string) {
    return {
      userId: userId,
    };
  }
}
