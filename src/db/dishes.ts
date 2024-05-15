import { getCategory } from "./categories";
import { db } from "./firebase";
import {collection, getDocs,addDoc, deleteDoc,doc, updateDoc, AddPrefixToKeys, DocumentReference} from 'firebase/firestore'
// Se obtiene la coleccion de platillos previamente creada en firebase
const dishesCol = collection(db,'Platillos')

// Se define la interfaz de platillos con los campos que se van a utilizar
interface Dish{
    nombre:string,
    descripcion:string,
    precio:string,
    categoria:DocumentReference,
    id:string
}

// Se exportan las funciones para interactuar con la base de datos
export const getDishes = async () => {
    // Se obtienen los platillos de la base de datos
    const dishesSnap = await getDocs(dishesCol)
    // Se mapean los platillos a un arreglo de objetos
    const dishesList = dishesSnap.docs.map(dish=>{return {...dish.data(),id:dish.id} as Dish})
    // Se crea un mapa con las categorias como llave y los platillos como valor
    const dishesMap = new Map<string,Array<Dish>>()
    // Se recorren los platillos para agregarlos al mapa
    await Promise.all(dishesList.map(async (dish)=>{
        const category = await getCategory(dish.categoria.id)
        if(dishesMap.has(category.nombre)) dishesMap.set(category.nombre,[...dishesMap.get(category.nombre) as Dish[],dish] as Array<Dish>)
        else dishesMap.set(category.nombre,[dish])
    }))
    // Se regresa el mapa con los platillos
    return dishesMap;
}

export const createDish = async (dish:Dish) => {
    // Se agrega el platillo a la base de datos
    await addDoc(dishesCol,dish)
}

export const deleteDish = async (id:string) => {
    // Se elimina el platillo de la base de datos con el id proporcionado
    await deleteDoc(doc(dishesCol,id))
}

export const updateDish = async (id:string,dish:Dish) => {
    // Se actualiza el platillo de la base de datos con el id proporcionado y los datos
    await updateDoc(doc(dishesCol,id),dish as unknown as AddPrefixToKeys<string, any>)
}