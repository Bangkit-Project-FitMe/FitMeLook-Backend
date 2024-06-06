import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class UsersService {
  private firestore: admin.firestore.Firestore;

  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {
    this.firestore = firebaseAdmin.firestore();
  }

  async postPredictImage(model: tf.GraphModel, image: Express.Multer.File) {
    try {
      const tensor = tf.node
        .decodeImage(image.buffer)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat();

      const classes = ['Squamous cell carcinoma', 'Vascular lesion'];

      const prediction = model.predict(tensor) as tf.Tensor;
      const score = await prediction.data();
      const confidenceScore = Math.max(...score) * 100;

      const classResult = tf.argMax(prediction, 1).dataSync()[0];
      const label = classes[classResult];

      let explanation, suggestion;

      if (label === 'Melanocytic nevus') {
        explanation =
          'Melanocytic nevus adalah kondisi di mana permukaan kulit memiliki bercak warna yang berasal dari sel-sel melanosit, yakni pembentukan warna kulit dan rambut.';
        suggestion =
          'Segera konsultasi dengan dokter terdekat jika ukuran semakin membesar dengan cepat, mudah luka atau berdarah.';
      }

      if (label === 'Squamous cell carcinoma') {
        explanation =
          'Squamous cell carcinoma adalah jenis kanker kulit yang umum dijumpai. Penyakit ini sering tumbuh pada bagian-bagian tubuh yang sering terkena sinar UV.';
        suggestion =
          'Segera konsultasi dengan dokter terdekat untuk meminimalisasi penyebaran kanker.';
      }

      if (label === 'Vascular lesion') {
        explanation =
          'Vascular lesion adalah penyakit yang dikategorikan sebagai kanker atau tumor di mana penyakit ini sering muncul pada bagian kepala dan leher.';
        suggestion =
          'Segera konsultasi dengan dokter terdekat untuk mengetahui detail terkait tingkat bahaya penyakit.';
      }

      return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
      return error;
    }
  }

  getHistories(userId: string) {
    return {
      userId: userId,
    };
  }

  getSpecificHistories(userId: string, predictionId: string) {
    return {
      userId: userId,
      predictionId: predictionId,
    };
  }

  async getUserData(userId: string) {
    const snapshot = await this.firestore.collection('users').doc(userId).get();
    const fetchedData = snapshot.data();

    if (fetchedData) {
      return {
        Status: 'success',
        message: 'Successfully GET ${user_id} data.',
        data: fetchedData,
      };
    }

    return {
      status: 'fail',
      message: 'Request gagal: User ID not found.',
      data: {},
    };
  }

  patchUserData(userId: string) {
    return {
      userId: userId,
    };
  }
}
