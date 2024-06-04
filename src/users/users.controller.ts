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
import { ModelService } from 'src/module/model.service';
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

    return this.usersService.postPredictImage(model, image);
    // this.firestoreService.uploadData(userId)
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
