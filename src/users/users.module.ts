import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ModelModule } from 'src/module/model.module';
import { FirestoreModule } from 'src/firestore/firestore.module';

@Module({
  imports: [ModelModule, FirestoreModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
