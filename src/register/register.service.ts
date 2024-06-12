import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class RegisterService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  async userRegister(userID: string, email: string, fullName: string) {
    try {
      const userDocRef = this.firestore.collection('users').doc(userID);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        return {
          status: 'failed',
          message:
            'An account with this user ID already exists in the database',
        };
      }

      await userDocRef.set({
        profiles: {
          email,
          full_name: fullName,
          created_at: new Date().toISOString(),
        },
      });

      return {
        status: 'success',
        message: 'Account successfully registered to the database.',
      };
    } catch (error) {
      return {
        status: 'failed',
        message:
          'Error registering account to the database. Please try again later.',
        error: error.message,
      };
    }
  }
}
