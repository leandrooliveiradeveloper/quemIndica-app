import { Usuario } from "../model/Usuario";

export interface RequestResponse {
    status: number;
    message: string;
    id: number;
    sucess: boolean;
    objeto: any | null;
}
