import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class LoginService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  async userLogin(email: string, password: string) {
    const snapshot = await this.firestore.collection('users').get();

    const fetchedData = snapshot.docs.map((doc) => doc.data());
    const user = fetchedData.filter((doc) => doc.email === email)[0];
    if (user) {
      if (user.password === password) {
        return {
          status: 'success',
          message: 'login successfully.',
        };
      }
    }

    return {
      status: 'failed',
      message: 'email or password is incorrect',
    };
  }
}
