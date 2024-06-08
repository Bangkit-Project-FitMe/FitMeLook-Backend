import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ForgetPasswordService {
  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {}

  async postForgetPassword(email: string, newPassword: string) {
    try {
      // Get the user by email
      const user = await admin.auth().getUserByEmail(email);
      const uid = user.uid;

      // Update the user's password
      await admin.auth().updateUser(uid, {
        password: newPassword,
      });

      return {
        status: 'success',
        message: 'Password updated successfully.',
      };
    } catch (error) {
      console.error('Error updating user password:', error);
      return {
        status: 'failed',
        message: 'Error updating user password.',
        error: error.message,
      };
    }
  }
}
