import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../header'; 
import { CardItem } from '../../components/cards/cardItem';
import { colors } from '../../assets/css/globalStyles';
import { Profissional } from '../../model/Profissional';
import { Usuario } from '../../model/Usuario';
import { Perfil } from '../../components/enum/Perfil';
import { Status } from '../../components/enum/Status';
import { Portifolio } from '../../model/Portifolio';


const usuario: Usuario = {
    id: 1,
    nome: "Maria Thereza",
    dataCadastro: new Date(),
    perfil: Perfil.Profissional,
    senha: "senhaSegura",
    status: Status.Ativo,
  };

  const usuario2: Usuario = {
    id: 2,
    nome: "Roberto Miranda",
    dataCadastro: new Date(),
    perfil: Perfil.Profissional,
    senha: "senhaSegura",
    status: Status.Ativo,
  };

   const listaPortfolio: Portifolio[] = [
     {id: "1", uri: "https://media.istockphoto.com/id/672022974/pt/foto/fresh-grilled-dorade-rose.jpg?s=1024x1024&w=is&k=20&c=oDcTXprCLWbRudU4i7eSLdvFsdaH9VmvFdcVNKq_NUk="},
     {id: "2", uri: "https://media.istockphoto.com/id/1140296796/pt/foto/baked-dorado-with-vegetables-and-green-sauce-view-from-above.jpg?s=612x612&w=0&k=20&c=ztvlqHXYuX5fDsi_sRzBR-j1ogbv5OYBiVmPj53ssLY="},
     {id: "3", uri: "https://media.istockphoto.com/id/916448498/pt/foto/grilled-seabream-on-carrot-onion-and-celery-stalks.jpg?s=612x612&w=0&k=20&c=59YdcFiiwaOc55FiJWF2zEM9XG0RKXIZKc-libAk03o="},
     {id: "4", uri: "https://media.istockphoto.com/id/953091918/pt/foto/whole-grilled-dorado-with-lemon-slices-on-table.jpg?s=612x612&w=0&k=20&c=AiVZMe3-JWOPVP21zop7WOdUO8015LWUovTXuUbFIUE="},
     {id: "5", uri: "https://media.istockphoto.com/id/892159736/pt/foto/festive-table-decoration.jpg?s=612x612&w=0&k=20&c=LSV8Q19cG-qQZfUoOB9OENePe9BV7sKQpwuM5ubrkOg="},
   ];

const profissional: Profissional = {
  id: 1,
  usuario: usuario,
  categorias: [],
  descricao: "Mais de 10 anos de experiência combinando várias viagens estudando divérsas culinárias mundiais",
  uriImagemPrincipal: "https://media.istockphoto.com/id/1252338682/pt/foto/female-chef-is-preparing-a-flamb%C3%A9-specialty.jpg?s=612x612&w=0&k=20&c=98zSrE1RIcKycUAvbZsKmOw1QjAIPZmF0JqrqwTYa1w=",
  imagemPortifolios: listaPortfolio,
  telefone: "(73) 98458-6635",
  disponibilidadeInicio: "08:00",
  disponibilidadeFim: "18:00",
  avaliacaoMedia: 5,
  profissao: "Cozinheira",
  servico: "Culinária Japonesa, Comida Brasileira, Doces e Salgados",
  rua: "Rua de Cima",
  numero: "5",
  bairro: "Centro",
  cep: "45500-000",
  estado: "Bahia",
  cidade: "Itacaré",
  latitude: "",
};

const profissional_2: Profissional = {
  id: 2,
  usuario: usuario2,
  categorias: [],
  descricao: "Pedreiro a mais de 20 anos aprendendo com meu pai que aprendeu com meu avo",
  uriImagemPrincipal: "https://media.istockphoto.com/id/1376721527/pt/foto/portrait-of-a-building-contractor-working-at-a-construction-site.jpg?s=612x612&w=0&k=20&c=13fG6j_Pxqv-sWxTOZZmfWbhRT1ISaOm6M6OoozYbmA=",
  imagemPortifolios: listaPortfolio,
  telefone: "(73) 98458-6635",
  disponibilidadeInicio: "08:00",
  disponibilidadeFim: "18:00",
  avaliacaoMedia: 3.2,
  profissao: "Pedreiro",
  servico: "Construção de Casas, Reformas em Geral, Manutenção",
  rua: "Rua de Cima",
  numero: "5",
  bairro: "Santa Maria",
  cep: "45500-000",
  estado: "Bahia",
  cidade: "Itacaré",
  latitude: "",
};

const profissionais = [profissional, profissional_2];

export function Busca() {
  
  return (
    <View style={styles.container}>
        
        <Header title="Buscar Profissionais" mensagem="Aqui estão os profissionais que existem" />

        
        <View style={styles.subheader}>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Quem você procura hoje?"
                    placeholderTextColor={colors.placeholdertext}
                    />
            </View>

            <FlatList 
                data={profissionais}
                keyExtractor={item => String(profissionais)}
                renderItem={({item}) => <CardItem item={ item } remover={false}  />}
            /> 
        </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subheader: {
    flex: 1,
    backgroundColor: '#e8e4e4fa',
    //  marginBottom: 16,
     padding: 16,
  },
searchInput: {
    height: 40,
    fontSize: 14,
    color: colors.text
  },
searchContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
});
