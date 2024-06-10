import { Module } from '@nestjs/common';
import { PredictionController } from './predictions.controller';
import { PredictionService } from './predictions.service';
@Module({
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}
