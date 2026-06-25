import { Perfil } from '../components/enum/Perfil';
import { Status } from '../components/enum/Status';

export interface Usuario {
    id: number;
    nome: string;
    senha: string;
    email: string;
    dataCadastro: Date;
    perfil: Perfil;
    status: Status;
}
