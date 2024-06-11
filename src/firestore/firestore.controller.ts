import { Controller, Get } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Get()
  async getList() {
    return await this.firestoreService.listBucketFiles();
  }
}
