import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

@Injectable()
export class FirestoreService {
  private firestore: admin.firestore.Firestore;
  private storage: any;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
    this.storage = firebaseAdmin
      .storage()
      .bucket('gs://fitmelook-project.appspot.com');
    console.log(typeof this.storage);
  }

  async uploadData(
    collection: string,
    id: string,
    data: any,
  ): Promise<admin.firestore.WriteResult> {
    const docRef = this.firestore.collection(collection).doc(id);
    return docRef.set(data);
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}${file.originalname}`;
    const fileRef = this.storage.file(fileName);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    return `https://storage.googleapis.com/${this.storage.name}/${fileName}`;
  }

  async savePredictionResult(file: Express.Multer.File, id: string, data: any) {
    // Upload the file to Firebase Storage
    const imageUrl = await this.uploadFile(file);

    // Add the image URL to the prediction data
    data.imageUrl = imageUrl;
    console.log(imageUrl);
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
