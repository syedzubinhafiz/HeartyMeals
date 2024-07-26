// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import {ConfigModule, ConfigService} from '@nestjs/config'
import * as admin from 'firebase-admin';

function initialiseFirebase(){
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // const firebaseConfig = {
  //   apiKey: process.env.FIREBASE_API_KEY,
  //   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  //   projectId: process.env.FIREBASE_PROJECT_ID,
  //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  //   appId: process.env.FIREBASE_APP_ID,
  //   measurementId: process.env.FIREBASE_MEASUREMENT_ID
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);

  // const storage = getStorage();

  var admin = require("firebase-admin");

  var serviceAccount = require("../../hf-nutrition-firebase-adminsdk-n9w73-b1e7fe6f15.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

export default initialiseFirebase;