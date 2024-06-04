import { Controller, Post, Get, Body } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirestoreService) {}

  @Post('upload')
  async uploadData(@Body() data: any) {
    const collection = 'predictions'; // Collection name
    const id = data.id || 'generated-id'; // Generate or use provided ID
    // const result = await this.firestoreService.uploadData(collection, id, data);
    await this.firestoreService.uploadData(collection, id, data);
    return { id };
  }

  @Get('fetch')
  async fetchData() {
    const collection = 'predictions'; // Collection name
    const data = await this.firestoreService.fetchData(collection);
    return data;
  }
}
