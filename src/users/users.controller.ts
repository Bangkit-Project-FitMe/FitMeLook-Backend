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
    if (!image.mimetype.match(/^image/)) {
      return {
        Status: 'fail',
        message: `Input salah: ${image.mimetype}. Silakan gunakan foto lain.`,
        data: {},
      };
    }
    const {
      seasonalTypeConfidenceScore,
      seasonalType,
      collarTypeConfidenceScore,
      collarType,
    } = await this.usersService.postPredictImage(image);

    const data = {
      clothing_colors: 'undefined',
      clothing_types: 'undefined',
      collar_type: collarType,
      seasonal_type: seasonalType,
      color_confidence_score: 'undefined',
      cloth_confidence_score: 'undefined',
      seasonal_type_confidence_score: seasonalTypeConfidenceScore,
      collar_type_confidence_score: collarTypeConfidenceScore,
      created_at: new Date().toISOString(),
    };

    await this.firestoreService.savePredictionResult(image, userId, data);

    const response = {
      status: 'success',
      message:
        seasonalTypeConfidenceScore > 50
          ? 'Model predicted successfully.'
          : 'Model predicted successfully but confidence is low. Please use a better image.',
      data,
    };
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
