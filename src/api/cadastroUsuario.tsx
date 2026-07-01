import Config from "react-native-config";
import { Usuario } from "../model/Usuario";
import { UsuarioSave } from "../modelUtils/UsuarioSave";

// export const BASE_URL = Config.BASE_URL;
const BASE_URL = "http://localhost:3000"; // ou IP da máquina


export async function SalvarUsuario(usuario: UsuarioSave) {
   const response = await fetch(`${BASE_URL}/CadastrarUsuario`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(usuario)
   });
   return response.json();
}


// export async function GetUsuarios(id: number) {
//   const response = await fetch(`${BASE_URL}/selecoes`);
//   return response.json();
// }

export async function ObterUsuario(id: number) {
  const response = await fetch(`${BASE_URL}/ObterUsuario/${id}`, {
    method: "GET",
  });
  return response.json();
}


