import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from '../model/Usuario';
import { UsuarioSave } from "../modelUtils/UsuarioSave";


const useStorege = () => {

    const saveUsuario = async (key: string, value: UsuarioSave) =>{
        try{
            await AsyncStorage.setItem(key, JSON.stringify(value));
        }catch(error){
            console.log("Erro ao salvar ", error);
        }
    }

     const getUsuario = async (key: string) => {
        try{
            const usuariostr = await AsyncStorage.getItem(key);
            const usuarioFinal: Usuario = usuariostr != null ? JSON.parse(usuariostr?.toString()) : null;
            return usuarioFinal
        }catch(error){
            console.log("Erro ao buscar", error);
            return null;
        }
    }

     const removeUsuario = async (key: string, item: Usuario) => {
         try{
             let usuario = await getUsuario(key);
             await AsyncStorage.setItem(key, "");
             return usuario;

         }catch(error){
             console.log("Erro ao apagar", error);
         }
     }

    return {
        getUsuario,
        saveUsuario,
        removeUsuario,
    }

}

export default useStorege;
