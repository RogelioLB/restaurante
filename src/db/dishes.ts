import { db } from "./firebase";
import {collection, getDocs} from 'firebase/firestore'

interface Dish{
    nombre:string,
    descripcion:string,
    precio:string,
    categoria:string
}

export const getDishes = async () => {
    const dishesCol = collection(db,'Platillos')
    const dishesSnap = await getDocs(dishesCol)
    const dishesList = dishesSnap.docs.map(dish=>dish.data() as Dish)
    const dishesMap = new Map<string,Array<Dish>>()
    dishesList.forEach((dish)=>{
        if(dishesMap.has(dish.categoria)) dishesMap.set(dish.categoria,[...[dishesMap.get(dish.categoria)],dish] as Array<Dish>)
        dishesMap.set(dish.categoria,[dish])
    })
    return dishesMap;
}