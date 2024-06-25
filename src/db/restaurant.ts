import { db } from "./firebase";
import { getDoc,collection,doc } from "firebase/firestore";

interface RestaurantInfo{
    ubicacion:string;
    dueño:string;
    historia:string;
}

export const getRestaurantInfo = async () => {
    return (await getDoc(doc(collection(db,'Restaurante'),'07oHHFvduDlkDQi8FmY3'))).data() as RestaurantInfo
}