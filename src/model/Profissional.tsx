import { ImageSourcePropType } from 'react-native';
import { Usuario } from './Usuario';
import { Categoria } from './Categoria';
import { Portifolio } from './Portifolio';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

export interface Profissional {
    id: number;
    usuario: Usuario;
    categorias: Categoria[];
    descricao: string;
    uriImagemPrincipal?: string;
    imagemPortifolios?: Portifolio[];
    telefone: string;
    disponibilidadeInicio: string;
    disponibilidadeFim: string;
    avaliacaoMedia: Float;
    servico: string; 
    profissao: string;          // é a string que traz todas as Categorias, profissões

    rua?: string;
    numero?: string;
    bairro: string;
    // cep: string;
    estado: string;
    cidade: string;
    latitude: string;
}
