//Importacion de las librerias necesarias para la conexion con firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Configuracion de firebase, se obtiene de la consola de firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID
};

// Inicializacion de la aplicacion y la base de datos
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)