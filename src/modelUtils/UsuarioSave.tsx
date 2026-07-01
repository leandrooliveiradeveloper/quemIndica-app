import { Perfil } from '../components/enum/Perfil';
import { Status } from '../components/enum/Status';

export interface UsuarioSave {
    id?: number;
    nome: string;
    senha?: string;
    email: string;
    dataCadastro: string;
    perfil: Perfil;
    status: Status;
}
