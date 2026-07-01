import Config from "react-native-config";
import { Usuario } from "../model/Usuario";
import { UsuarioSave } from "../modelUtils/UsuarioSave";

// export const BASE_URL = Config.BASE_URL;
const BASE_URL = "http://localhost:3000"; // ou IP da máquina


export async function SalvarUsuario(usuario: UsuarioSave) {
   const response = await fetch(`${BASE_URL}/Usuario/CadastrarUsuario`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(usuario)
   });
   return response.json();
}

export async function ObterUsuario(id: number) {
  console.log("ObterUsuario id: " + id);
  const response = await fetch(`${BASE_URL}/Usuario/ObterUsuario/${id}`, {
    method: "GET",
  });
  return response.json();
}

export async function LogarUsuario(usuario: any) {
   const response = await fetch(`${BASE_URL}/Usuario/Login`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(usuario)
   });
   return response.json();
}

export async function UpdateUsuario(id: number, usuario: any) {
   const response = await fetch(`${BASE_URL}/Usuario/Update/${id}`, {
     method: 'PUT',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(usuario)
   });
   return response.json();
}


