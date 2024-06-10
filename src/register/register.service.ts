import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class RegisterService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  // ! Related to line 28
  async userRegister(full_name: string, email: string, password: string) {
    try {
      const snapshot = await this.firestore
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!snapshot.empty) {
        return {
          status: 'failed',
          message:
            'Email has already been registered. Please choose a different email address to register.',
        };
      }

      // ! Discuss with MD
      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      const userDocRef = this.firestore.collection('users').doc(userRecord.uid);

      await userDocRef.set({
        profiles: {
          email,
          fullName: full_name,
          // Use toISOString for Production Env
          created_at: new Date().toISOString(),
        },
      });

      return {
        status: 'success',
        message: 'Account created successfully.',
        // Delete this when in production
        uid: userRecord.uid,
      };
    } catch (error) {
      console.log('Error creating new user:', error);
      return {
        status: 'failed',
        message: 'Error creating new user. Please try again later.',
        error: error.message,
      };
    }
  }
}
