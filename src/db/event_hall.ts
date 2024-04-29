import { collection, getDocs } from "firebase/firestore";
import {EventHall} from '../../types.ts'
import { db } from "./firebase";


// Get all event halls
export const getAllEventHalls = async () => {
  const snapshot = await collection(db,"Salones");
  const docs = await getDocs(snapshot);
  return docs.docs.map((doc) => doc.data() as EventHall);
};