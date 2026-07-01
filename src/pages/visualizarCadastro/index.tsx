import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { colors, globalStyles } from '../../assets/css/globalStyles';
import { useNavigation } from '@react-navigation/native';
import useStorege from '../../hooks/useStorege';
import { Usuario } from '../../model/Usuario';
import { UsuarioSave } from '../../modelUtils/UsuarioSave';
import { RequestResponse } from '../../modelUtils/RequestResponse';
import { ObterUsuario } from "../../api/cadastroUsuario";
import type { RootStackParamList } from "../routes/types";
import type { StackNavigationProp } from "@react-navigation/stack";

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tabs'>;

export function VisualizarCadastro() {

  const navigation = useNavigation<NavigationProp>();

    // const navigation = useNavigation();
    const { getUsuario, removeUsuario }  = useStorege();
    const[usuario, setUsuario] = useState<Usuario | null>(null);

        useEffect(() => {
     if (usuario) {
       console.log("usuario atualizado:", JSON.stringify(usuario));
     }
  }, [usuario]); // esse só observa mudanças, não altera o estado

     useEffect(() => {
         const verificarUsuario = async () => {
           try {
              const usuarioStorege = await getUsuario("@usuario");
               if (usuarioStorege) {
                  const response: RequestResponse | null = await ObterUsuario(usuarioStorege.id);
                  const usuarioApi: Usuario = response?.objeto as Usuario;
                 setUsuario(usuarioApi);
                }else{
                 console.log("Erro ao obter usuário do storage: " + usuario);
               }
           } catch (error) {
             console.log("Erro ao obter usuário do storage:", error);
           }
         };
    
         verificarUsuario();
       }, []);

    async function sair() {
      const usuarioStorege = await getUsuario("@usuario");
      if(usuarioStorege!=undefined && usuarioStorege!=null){
        const usuarioRemovido = await removeUsuario("@usuario", usuarioStorege);
        console.log("usuarioRemovido: " + usuarioRemovido);
        setUsuario(null);
        navigation.goBack();
      }
    }

    async function obterUsuarioApi(item: Usuario): Promise<Usuario | null> {
      const response: RequestResponse = await ObterUsuario(item?.id || 0);
      console.log("usuarioApi JSON: " + JSON.stringify(response));
      if(response.sucess){
        const usuarioApi: Usuario = response.objeto as Usuario;
        console.log("usuarioFinal API: " + JSON.stringify(usuarioApi));
        // const usuarioFinal: Usuario = { id: usuarioApi.id, nome: usuarioApi.nome, email: usuarioApi.email, dataCadastro: new Date(usuarioApi.dataCadastro), perfil: usuarioApi.perfil, senha: usuarioApi.senha, status: usuarioApi.status };
        setUsuario(usuarioApi);
        console.log("usuarioFinal API: " + JSON.stringify(usuario));
      }
      console.log("Response 1: " + JSON.stringify(response));

      return usuario;
    }



  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Image source={require('../../assets/image/logo.png')} style={[globalStyles.logo]} />
        {/* <Text style={styles.greeting}>Olá, Leandro!</Text> */}
      </View>

      {/* <Text style={styles.name}>João Silva</Text>
      <Text style={styles.email}>joao.silva@email.com</Text> */}

      <View style={styles.infoCard}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{usuario?.nome}</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{usuario?.email}</Text>
      </View>

      {/* <View style={styles.infoCard}>
        <Text style={styles.label}>Telefone</Text>
        <Text style={styles.value}>(11) 98765-4321</Text>
      </View> */}

      <TouchableOpacity style={styles.buttonGray} onPress={() => navigation.navigate('CadastroUsuarioForm')}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonRed} onPress={sair}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
   header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    color: '#555',
    marginTop: 5,
  },
  buttonGray: {
    width: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonRed: {
    width: '100%',
    backgroundColor: '#e63946',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
