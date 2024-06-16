import { Body, Controller, Get } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get()
  async getList(
    @Body('seasonal_type') seasonalType: string,
    @Body('face_shape') faceShape: string,
  ) {
    return await this.firestoreService.listBucketFiles(seasonalType, faceShape);
  }
}
