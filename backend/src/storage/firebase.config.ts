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

  var admin = require("firebase-admin");

  const firebase_config = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
  };

  // var serviceAccount = require(JSON.stringify(firebase_config));

  admin.initializeApp({
    credential: admin.credential.cert(firebase_config),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });
}

export default initialiseFirebase;