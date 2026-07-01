import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, globalStyles } from '../../assets/css/globalStyles';
import { Usuario } from '../../model/Usuario';
import { Perfil } from '../../components/enum/Perfil';
import { Status } from '../../components/enum/Status';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SalvarUsuario, UpdateUsuario } from "../../api/cadastroUsuario";
import { formatarData } from "../../utils/utils";
import { UsuarioSave } from '../../modelUtils/UsuarioSave';
import { ModalMensagem } from '../../components/modalMensagem';
import { RequestResponse } from '../../modelUtils/RequestResponse';
import useStorege from '../../hooks/useStorege';
import { useUserStore } from '../../utils/userStore';

interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
}

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  senha: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmaSenha: Yup.string().required('Confirmação de senha é obrigatória').min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
});

export function CadastroUsuarioForm() {

  const navigation = useNavigation();

  const[usuario, setUsuario] = useState<Usuario>();
  const[validaSenha, setValidaSenha] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { saveUsuario, getUsuario }  = useStorege();
  const { setExisteUsuario } = useUserStore();
  const [modalMessage, setModalMessage] = useState('');

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<UsuarioForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<UsuarioForm> = (data) => {
    console.log('Dados enviados:', data);
    setValidaSenha(false);

    if(data.senha != data.confirmaSenha){
      setValidaSenha(true);
      return;
    }

    const idUsuario = usuario != undefined ? usuario.id : 0;

    const newUsuario: Usuario = {
        id: idUsuario,
        nome: data.nome,
        email: data.email,
        dataCadastro: new Date(),
        perfil: Perfil.Cliente,
        senha: data.senha,
        status: Status.Ativo,
      };

     setUsuario(newUsuario);     
     salvaUsuarioApi(newUsuario);    
  };

  async function salvaUsuarioApi(item: Usuario) {
    const usuarioSave: UsuarioSave = { nome: item.nome, senha: item.senha, email: item.email, dataCadastro: formatarData(item.dataCadastro), perfil: item.perfil, status: item.status };

    let response: RequestResponse = {} as RequestResponse;

    if(usuario != undefined && usuario.id != undefined && usuario.id > 0){
      console.log("Atualizando usuario: " + JSON.stringify(usuarioSave));
      response = await UpdateUsuario(usuario.id, usuarioSave);
    }else{
      console.log("Salvando usuario: " + JSON.stringify(usuarioSave));
      response = await SalvarUsuario(usuarioSave);
    }

    console.log("Response 1: " + JSON.stringify(response));

     if(response.sucess){
       usuarioSave.id = response.id;
       saveUsuario("@usuario", usuarioSave);
       console.log("Response 2: " + JSON.stringify(usuarioSave));
       setExisteUsuario(true);
       navigation.goBack();
     }else{
       setModalVisible(true);
       setModalMessage(response.message);
     }

  }


    useEffect(() => {
    const verificarUsuario = async () => {
      try {
        const usuarioStorege = await getUsuario("@usuario");
        if (usuarioStorege) {
          setValue("nome", usuarioStorege.nome);
          setValue("email", usuarioStorege.email);
          setUsuario(usuarioStorege);
          console.log("usuario JSON: " + JSON.stringify(usuarioStorege));
        }else{
          console.log("Erro ao obter usuário do storage: " + usuario);
        }
      } catch (error) {
        console.log("Erro ao obter usuário do storage:", error);
      }
    };

    verificarUsuario();
  }, []); // [] garante que roda só uma vez ao montar a tela

   useEffect(() => {
    // if (usuario) {
    //   console.log("usuario atualizado:", JSON.stringify(usuario));
    // }
  }, [usuario]); // esse só observa mudanças, não altera o estado

  
  return (
    
    <ScrollView style={styles.container}>

      <Modal visible={modalVisible} animationType='fade' transparent={true}>
        <ModalMensagem handleClose={() => setModalVisible(false)} type={'error'} message={modalMessage} ></ModalMensagem>
      </Modal>

      {/* Header com logo e saudação */}
      <View style={styles.header}>
        <Image source={require('../../assets/image/logo.png')} style={[globalStyles.logo]} />
      </View>

      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              placeholderTextColor={colors.placeholdertext}
              value={value}
              onChangeText={onChange}
              maxLength={150}
            />
            <View style={styles.msgErro}>{errors.nome && <Text style={styles.textErro}>{errors.nome.message}</Text>}</View>
          </>
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.placeholdertext}
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={50}
            />
            <View style={styles.msgErro}>{errors.email && <Text style={styles.textErro}>{errors.email.message}</Text>}</View>
          </>
        )}
      />

      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange, value } }) => (
          <>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={value}
            placeholderTextColor={colors.placeholdertext}
            onChangeText={onChange}
            secureTextEntry
          />
            <View style={styles.msgErro}>{errors.senha && <Text style={styles.textErro}>{errors.senha.message}</Text>}</View>
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmaSenha"
        render={({ field: { onChange, value } }) => (
          <>
          <TextInput
            style={styles.input}
            placeholder="Confirma Senha"
            value={value}
            placeholderTextColor={colors.placeholdertext}
            onChangeText={onChange}
            secureTextEntry
            />
            <View style={styles.msgErro}>{errors.confirmaSenha && <Text style={styles.textErro}>{errors.confirmaSenha.message}</Text>}</View>
            <View style={styles.msgErro}>{validaSenha && <Text style={styles.textErro}>As senhas estão diferente</Text>}</View>
          </>
        )}
      />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Salvar Cadastro</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.terms}>
        Ao cadastrar-se, você concorda com os Termos de Uso e Política de Privacidade.
      </Text>

    </ScrollView> 

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    paddingBottom: 40,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancel: {
    backgroundColor: colors.btncancelar,
  },
  save: {
    backgroundColor: '#25D366',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  terms: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
   placeholderText: {
      color: colors.text
   },
   header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#F9F9F9',
    color: colors.text,
    marginBottom: 5,
  },
  textErro: {
  color: colors.formerro,
  },
  msgErro: {
    marginBottom: 12,
  }
});
