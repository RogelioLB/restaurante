import { db } from "./firebase"
import { DocumentReference, addDoc, collection } from "firebase/firestore"

interface Booking{
    correo: string,
    cotizacion: string,
    reservacion: {
        fecha:Date,
        personas:string,
        salon:DocumentReference
    }
}

export const createBooking = async (booking: Booking) => {
    await addDoc(collection(db,"Reservaciones"), booking)
}