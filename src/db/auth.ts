import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,  AuthError } from "firebase/auth";
import { app } from "./firebase";

export const auth = getAuth(app);

export const createUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (err) {
        const error = err as AuthError;
        switch (error.code) {
            case "auth/email-already-in-use":
                return "El correo ya está en uso";
            case "auth/weak-password":
                return "La contraseña es muy débil";
            case "auth/invalid-email":
                return "El correo no es válido";
            case "auth/operation-not-allowed":
                return "Operación no permitida";
            case "auth/invalid-credential":
                return "Credenciales inválidas";
            case "auth/internal-error":
                return "Error interno";
            default:
                return error;
        }
    }
}

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (err) {
        const error = err as AuthError;
        switch (error.code) {
            case "auth/user-not-found":
                return "El usuario no existe";
            case "auth/wrong-password":
                return "Contraseña incorrecta";
            default:
                return error;
        }
    }
}

export const getUser = () => {
    return auth.currentUser;
}