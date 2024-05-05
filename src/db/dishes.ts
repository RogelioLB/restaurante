import { getCategory } from "./categories";
import { db } from "./firebase";
import {collection, getDocs,addDoc, deleteDoc,doc, updateDoc, AddPrefixToKeys, DocumentReference} from 'firebase/firestore'

const dishesCol = collection(db,'Platillos')

interface Dish{
    nombre:string,
    descripcion:string,
    precio:string,
    categoria:DocumentReference,
    id:string
}

export const getDishes = async () => {
    const dishesSnap = await getDocs(dishesCol)
    const dishesList = dishesSnap.docs.map(dish=>{return {id:dish.id,...dish.data()} as Dish})
    const dishesMap = new Map<string,Array<Dish>>()
    await Promise.all(dishesList.map(async (dish)=>{
        const category = await getCategory(dish.categoria.id)
        if(dishesMap.has(category.nombre)) dishesMap.set(category.nombre,[...dishesMap.get(category.nombre) as Dish[],dish] as Array<Dish>)
        else dishesMap.set(category.nombre,[dish])
        console.log(dishesMap.get(category.nombre))
    }))
    return dishesMap;
}

export const createDish = async (dish:Dish) => {
    await addDoc(dishesCol,dish)
}

export const deleteDish = async (id:string) => {
    await deleteDoc(doc(dishesCol,id))
}

export const updateDish = async (id:string,dish:Dish) => {
    await updateDoc(doc(dishesCol,id),dish as unknown as AddPrefixToKeys<string, any>)
}