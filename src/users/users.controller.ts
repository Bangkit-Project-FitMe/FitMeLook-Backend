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
      faceShapeConfidenceScore,
      faceShape,
    } = await this.usersService.postPredictImage(image);

    const responseImages = await this.firestoreService.listBucketFiles(
      seasonalType,
      faceShape,
    );

    const data = {
      face_shape: faceShape,
      seasonal_type: seasonalType,
      face_shape_confidence_score: faceShapeConfidenceScore,
      seasonal_type_confidence_score: seasonalTypeConfidenceScore,
      created_at: new Date().toISOString(),
      response_images: responseImages,
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

  @Get(':id')
  getUserData(@Param('id') userId: string) {
    return this.usersService.getUserData(userId);
  }

  @Patch(':id')
  patchUserData(@Param('id') userId: string) {
    return this.usersService.patchUserData(userId);
  }
}
