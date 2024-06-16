import { Controller, Get, Param } from '@nestjs/common';
import { PredictionService } from './predictions.service';

@Controller('users/:userID/predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}
  @Get()
  async getUserAllPredictions(@Param('userID') userID: string) {
    return this.predictionService.getUserAllPredictions(userID);
  }
  @Get(':predictionID')
  async getPredictionByID(
    @Param('userID') userID: string,
    @Param('predictionID') predictionID: string,
  ) {
    return this.predictionService.getPredictionByID(userID, predictionID);
  }
}
