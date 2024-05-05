import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const categoriesCol = collection(db, 'Categorias');
interface Category{
    nombre:string,
    id:string
}

export const getCategories = async () => {
    const categoriesSnap = await getDocs(categoriesCol)
    const categoriesList = categoriesSnap.docs.map(category=> {
        return {id:category.id,...category.data()} as Category
    })
    return categoriesList;
}

export const getCategory = async (id: string) => {
    const category = await getDoc(doc(categoriesCol, id));
    return category.data() as Category;
}