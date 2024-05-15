//Importacion de las librerias necesarias para la conexion con firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Configuracion de firebase, se obtiene de la consola de firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRiPLQRnEqf2ESvRGRJwZRAIHSh-1cC9E",
  authDomain: "restaurante-8cb6e.firebaseapp.com",
  projectId: "restaurante-8cb6e",
  storageBucket: "restaurante-8cb6e.appspot.com",
  messagingSenderId: "490622421551",
  appId: "1:490622421551:web:63cfe9f0fbd4f4284d14da"
};

// Inicializacion de la aplicacion y la base de datos
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)