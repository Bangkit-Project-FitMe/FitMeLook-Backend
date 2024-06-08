import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class RegisterService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }
  

  async userRegister(email: string, password: string) {
    try {
      const snapshot = await this.firestore.collection('users')
      .where('email', '==', email)
      .get();

      if (!snapshot.empty) {
          return {
            status: 'failed',
            message: 'Email has been registered. please use another email.',
          };
      }

      const userRecord = await admin.auth().createUser({
        email,
        password,
      });

      await this.firestore.collection('users').doc(userRecord.uid).set({
       email, 
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
        message: 'Error creating new user.',
        error: error.message,
      };
    }
  }
}
