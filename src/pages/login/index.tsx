import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { colors, globalStyles } from '../../assets/css/globalStyles';
import type { RootStackParamList } from "../routes/types";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RequestResponse } from '../../modelUtils/RequestResponse';
import { LogarUsuario } from "../../api/cadastroUsuario";
import useStorege from '../../hooks/useStorege';
import { Usuario } from '../../model/Usuario';
import { UsuarioSave } from '../../modelUtils/UsuarioSave';
import { ModalMensagem } from '../../components/modalMensagem';
import { useUserStore } from '../../utils/userStore';
import Icon from 'react-native-vector-icons/FontAwesome';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Tabs'>;

interface UsuarioLogin {
  senha: string;
  email: string;
}

export function Login() {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { getUsuario, saveUsuario }  = useStorege();

  const { setExisteUsuario } = useUserStore();

  const[email, setEmail] = useState<string>('');
  const[senha, setSenha] = useState<string>('');

   async function handleLogin() {
    
    setModalVisible(false);
    setModalMessage('');
    const usuarioLogar: UsuarioLogin = {email: email, senha: senha};
    const response: RequestResponse = await LogarUsuario(usuarioLogar);

    console.log("response Login: " + JSON.stringify(response));

    if(response.sucess){
      const usuario: UsuarioSave = response.objeto as UsuarioSave;
      usuario.id = response.id != null ? response.id : 0;
      await saveUsuario('@usuario', usuario);
      setExisteUsuario(true);
    }else{
      console.log("FALSE");
      setModalVisible(true);
      setModalMessage(response.message);
    }

  }

  
  return (

    <View style={styles.container}>

      <Modal visible={modalVisible} animationType='fade' transparent={true}>
        <ModalMensagem handleClose={() => setModalVisible(false)} type={'error'} message={modalMessage} ></ModalMensagem>
      </Modal>

      {/* Logo */}
      <Image
        source={require('../../assets/image/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {/* Campos de entrada */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.placeholdertext}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.placeholdertext}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botões */}
      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>


    <TouchableOpacity onPress={() => navigation.navigate('CadastroUsuarioForm')}>
      <Text style={styles.link}>Esqueci minha senha</Text>
    </TouchableOpacity>


<Text style={[styles.link, { marginTop: 50, marginBottom: 10, fontSize: 15 }]}>Como deseja se cadastrar?</Text>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('CadastroUsuarioForm')}>
        <Text style={styles.buttonText}><Icon name="user" size={17} color="#FFF" />  Usuario</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.buttonSecondary, {backgroundColor: colors.background}]} onPress={() => navigation.navigate('CadastroForm')}>
        <Text style={styles.buttonText}><Icon name="briefcase" size={17} color="#FFF" />  Profissional</Text>
      </TouchableOpacity>

</View>



      {/* Link de recuperação */}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 300,
    height: 300,
  },
  input: {
    width: '100%',
    color: colors.text,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonPrimary: {
    width: '100%',
    backgroundColor: '#FF7043', // laranja
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonSecondary: {
    width: '48%',
    backgroundColor: '#1676e3', // azul
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#F2F2F2',
    marginTop: 15,
    fontSize: 14,
  },
});
