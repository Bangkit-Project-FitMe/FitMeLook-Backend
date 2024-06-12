import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid'; // For generating unique file names

@Injectable()
export class FirestoreService {
  private firestore: admin.firestore.Firestore;
  private storagePostPredict: any;
  private storageResponseImages: any;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
    this.storagePostPredict = firebaseAdmin
      .storage()
      .bucket('gs://fitmelook-project.appspot.com');
    this.storageResponseImages = firebaseAdmin
      .storage()
      .bucket('gs://fitmelook-response-images');
  }

  async listBucketFiles() {
    const list = await this.storageResponseImages.getFiles();
    // Extract the array of File objects (which is the first element of the main array)
    const fileObjects = list[0];

    // Use map to extract the id properties
    const ids = fileObjects.map(
      (file) =>
        `https://storage.cloud.google.com/fitmelook-response-images/${file.id}`,
    );

    return ids;
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${uuidv4()}.${file.mimetype.split('/').pop()}`;
    const fileRef = this.storagePostPredict.file(fileName);

    await fileRef.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    return `https://storage.googleapis.com/${this.storagePostPredict.name}/${fileName}`;
  }

  async savePredictionResult(file: Express.Multer.File, id: string, data: any) {
    // Upload the file to Firebase Storage
    const imageUrl = await this.uploadFile(file);

    // Add the image URL to the prediction data
    data.image_url = imageUrl;
    try {
      // Reference to the user's Predictions subcollection
      const predictionsRef = this.firestore
        .collection('users')
        .doc(id)
        .collection('predictions');

      // Add a new document to the Predictions subcollection
      const newPredictionRef = await predictionsRef.add(data);

      return {
        status: 'success',
        message: 'Prediction successfully added to the database.',
      };
    } catch (error) {
      return error;
    }
  }
}
