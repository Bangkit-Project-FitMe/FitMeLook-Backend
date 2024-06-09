import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  async uploadData(
    collection: string,
    id: string,
    data: any,
  ): Promise<admin.firestore.WriteResult> {
    const docRef = this.firestore.collection(collection).doc(id);
    return docRef.set(data);
  }

  async savePredictionResult(id: string, data: any) {
    try {
      // Reference to the user's Predictions subcollection
      const predictionsRef = this.firestore
        .collection('users')
        .doc(id)
        .collection('predictions');

      // Add a new document to the Predictions subcollection
      const newPredictionRef = await predictionsRef.add(data);

      console.log(`Prediction added with ID: ${newPredictionRef.id}`);
      return newPredictionRef.id;
    } catch (error) {
      console.error('Error adding prediction:', error);
    }
  }

  async fetchData(collection: string): Promise<any[]> {
    const snapshot = await this.firestore.collection(collection).get();
    return snapshot.docs.map((doc) => doc.data());
  }
}
