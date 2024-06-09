import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ModelService } from 'src/model/model.service';
import { FirestoreService } from 'src/firestore/firestore.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly modelService: ModelService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Post(':id/predict')
  @UseInterceptors(FileInterceptor('image'))
  async postPredictImage(
    @Param('id') userId: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const model = this.modelService.getModel();

    if (!model) {
      throw new Error('Model is not loaded');
    }

    const { seasonalTypeConfidenceScore, seasonalType } =
      await this.usersService.postPredictImage(model, image);

    // const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      // id: id,
      clothing_colors: 'undefined',
      clothing_types: 'undefined',
      seasonal_type: seasonalType,
      color_confidenceScore: 'undefined',
      cloth_confidenceScore: 'undefined',
      Seasonal_type_confidenceScore: seasonalTypeConfidenceScore,
      createdAt: createdAt,
    };

    // await this.firestoreService.uploadData('users', userId, data);
    await this.firestoreService.savePredictionResult(image, userId, data);

    const response = {
      status: 'success',
      message:
        seasonalTypeConfidenceScore > 99
          ? 'Model predicted successfully.'
          : 'Model predicted successfully but confidence is low. Please use a better image.',
      data,
    };
    // console.log(data);
    return response;
  }

  @Get(':id/histories')
  getHistories(@Param('id') userId: string) {
    return this.usersService.getHistories(userId);
  }

  @Get(':id/histories/:predictionId')
  getSpecificHistories(
    @Param('id') userId: string,
    @Param('predictionId') predictionId: string,
  ) {
    return this.usersService.getSpecificHistories(userId, predictionId);
  }

  @Get(':id')
  getUserData(@Param('id') userId: string) {
    return this.usersService.getUserData(userId);
  }

  @Patch(':id')
  patchUserData(@Param('id') userId: string) {
    return this.usersService.patchUserData(userId);
  }
}
