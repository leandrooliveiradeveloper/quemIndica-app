import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { colors, globalStyles } from '../../assets/css/globalStyles';
import { useNavigation } from '@react-navigation/native';
import useStorege from '../../hooks/useStorege';
import { Usuario } from '../../model/Usuario';
import { RequestResponse } from '../../modelUtils/RequestResponse';
import { ObterUsuario } from "../../api/cadastroUsuario";
import type { RootStackParamList } from "../routes/types";
import type { StackNavigationProp } from "@react-navigation/stack";
import { useUserStore } from '../../utils/userStore';
  import { useFocusEffect } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tabs'>;

export function VisualizarCadastro() {

  const navigation = useNavigation<NavigationProp>();
  const { setExisteUsuario } = useUserStore();

  const { getUsuario, removeUsuario }  = useStorege();
  const[usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
     if (usuario) {
       console.log("usuario atualizado:", JSON.stringify(usuario));
     }
  }, [usuario]); // esse só observa mudanças, não altera o estado


useFocusEffect(
    useCallback(() => {
      const verificarUsuario = async () => {
        console.log("verificando usuario no storage...");
        try {
          const usuarioStorege = await getUsuario("@usuario");
          console.log("usuarioStorege: " + JSON.stringify(usuarioStorege));
          if (usuarioStorege) {
           const response: RequestResponse = await ObterUsuario(usuarioStorege.id);
               const usuarioApi: Usuario = response?.objeto as Usuario;
               setUsuario(usuarioApi);
               setExisteUsuario(true);
             }else{
               console.log("Não achou usuario no storage: " + usuario);
               setExisteUsuario(false);
             }
        } catch (error) {
          console.log("Erro ao obter usuário do storage:", error);
        }
      };

      verificarUsuario();
    }, [])
  );

    async function sair() {
      console.log("Sair do app");
      const usuarioStorege = await getUsuario("@usuario");
      if(usuarioStorege!=undefined && usuarioStorege!=null){
        const usuarioRemovido = await removeUsuario("@usuario", usuarioStorege);
        console.log("usuarioRemovido: " + JSON.stringify(usuarioRemovido));
        setUsuario(null);
        setExisteUsuario(false);
      }
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
