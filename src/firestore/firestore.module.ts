import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreService } from './firestore.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: (configService: ConfigService) => {
        const serviceAccountPath = configService.get<string>(
          'FIREBASE_SERVICE_ACCOUNT_PATH',
        );
        return admin.initializeApp({
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          credential: admin.credential.cert(require(serviceAccountPath)),
        });
      },
      inject: [ConfigService],
    },
    FirestoreService,
  ],
  exports: ['FIREBASE_ADMIN', FirestoreService],
})
export class FirestoreModule {}
