import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Image, FlatList, 
  KeyboardAvoidingView, Platform, Switch, Modal } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, globalStyles } from '../../assets/css/globalStyles';

import { Usuario } from '../../model/Usuario';
import { Categoria } from '../../model/Categoria';
import { Portifolio } from '../../model/Portifolio';
import { Profissional } from '../../model/Profissional';
import { Perfil } from '../../components/enum/Perfil';
import { Status } from '../../components/enum/Status';

import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useFocusEffect } from '@react-navigation/native';
import { GetAllAtivos, ObterTodosByProfissional } from "../../api/CategoriaController";
import { UsuarioSave } from '../../modelUtils/UsuarioSave';
import { formatarData } from '../../utils/utils';
import { RequestResponse } from '../../modelUtils/RequestResponse';
import { SalvarProfissional, UpdateProfissional, ObterProfissionalByUsuario, UpdateImagem, deleteFoto } from "../../api/ProfissionalController";
import useStorege from '../../hooks/useStorege';
import { useUserStore } from '../../utils/userStore';
import { ModalMensagem } from '../../components/modalMensagem';
import { URL_IMG_PROFISSIONAL } from '@env'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ModalConfirmacao } from '../../components/modalConfirmacao';
import LoadingModal from '../../components/modalPreloader';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../routes/types';

type NavigationProp = StackNavigationProp<RootStackParamList>;


interface ProfissionalForm {
  // uriimagemprincipal: ImageSourcePropType;
  nome: string;
  email: string;
  servico: string; 
  telefone: string;
  descricao: string;
  senha: string;
  confirmaSenha: string;
  disponibilidadeInicio: string;
  disponibilidadeFim: string;
  rua?: string;
  numero?: string;
  bairro: string;
  cidade: string;
  estado: string;
  // status: string;
}

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  servico: Yup.string().required('serviço é obrigatório, por favor separe por vírgula (",")'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  descricao: Yup.string().required('Descição é obrigatório'),
  senha: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmaSenha: Yup.string().required('Confirmação de senha é obrigatória').min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
  // rua: Yup.string().required('Endereço é obrigatório'),
  // numero: Yup.string().required('Obrigatório'),
  bairro: Yup.string().required('Bairro é Obrigatório'),
  cidade: Yup.string().required('Cidade é Obrigatório'),
  estado: Yup.string().required('Obrigatório'),
  // status: Yup.string().required('Obrigatório'),

  disponibilidadeInicio: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato deve ser HH:mm')
    .required('Horário inicial obrigatório'),

  disponibilidadeFim: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato deve ser HH:mm')
    .required('Horário final obrigatório')
    .test('is-greater', 'Horário final deve ser maior que o inicial', function(value) {
      const { disponibilidadeInicio } = this.parent;
      if (!disponibilidadeInicio || !value) return true;

      // Converter para minutos desde 00:00
      const [hIni, mIni] = disponibilidadeInicio.split(':').map(Number);
      const [hFim, mFim] = value.split(':').map(Number);

      const inicioMin = hIni * 60 + mIni;
      const fimMin = hFim * 60 + mFim;

      return fimMin > inicioMin;
    }),
});


interface CategoriaCombo {
  value: number;
  label: string;
};

export function CadastroForm() {

  const [loading, setLoading] = useState(false);
  const [openCidade, setOpenCidade] = useState(false);
  const [cidades, setCidades] = useState([
    { label: 'AC', value: 'AC' },
    { label: 'AL', value: 'AL' },
    { label: 'AP', value: 'AP' },
    { label: 'AM', value: 'AM' },
    { label: 'BA', value: 'BA' },
    { label: 'CE', value: 'CE' },
    { label: 'DF', value: 'DF' },
    { label: 'ES', value: 'ES' },
    { label: 'GO', value: 'GO' },
    { label: 'MA', value: 'MA' },
    { label: 'MT', value: 'MT' },
    { label: 'MS', value: 'MS' },
    { label: 'MG', value: 'MG' },
    { label: 'PA', value: 'PA' },
    { label: 'PB', value: 'PB' },
    { label: 'PR', value: 'PR' },
    { label: 'PE', value: 'PE' },
    { label: 'PI', value: 'PI' },
    { label: 'RJ', value: 'RJ' },
    { label: 'RN', value: 'RN' },
    { label: 'RS', value: 'RS' },
    { label: 'RO', value: 'RO' },
    { label: 'RR', value: 'RR' },
    { label: 'SC', value: 'SC' },
    { label: 'SP', value: 'SP' },
    { label: 'SE', value: 'SE' },
    { label: 'TO', value: 'TO' },
  ]);

  const[profissional, setProfissional] = useState<Profissional>();

  const[fotoPrincipal, setFotoPrincipal] = useState<any>(null);

  // const[listaPortifolio, setListaPortifolio] = useState<Portifolio[]>([]);
  const[listaPortifolio, setListaPortifolio] = useState<any[]>([]);

  const { saveUsuario, getUsuario }  = useStorege();
  const { setExisteUsuario } = useUserStore();
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [secureSenha, setSecureSenha] = useState(true);
  
  const navigation = useNavigation<NavigationProp>();

  const escolherImagem = () => {
    try{
        launchImageLibrary(
            { mediaType: 'photo', includeBase64: true }, // includeBase64 pega os bytes
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    const asset: any = response.assets[0];
                    // const profissionaAsset: ProfissionalForm = {uriimagemprincipal: asset};
                    setFotoPrincipal(asset);
                }
            }
        );
    }catch(error){
        console.log("REACT ERRO: " + error);
    }

  };

  const escolherImagemPortifolio = () => {

    try{
        launchImageLibrary(
            { mediaType: 'photo', includeBase64: true }, // includeBase64 pega os bytes
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    const asset = response.assets[0];
                    if(listaPortifolio == undefined){
                      console.log("ENTROU");
                        setListaPortifolio([])
                    }
                    const novaListaNova = listaPortifolio;
                    novaListaNova.push(asset);
                    setListaPortifolio(novaListaNova);
                }
            }
        );
    }catch(error){
        console.log("REACT ERRO: " + error);
    }

  };

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ProfissionalForm>({
    resolver: yupResolver(schema),
  });

  function preencheProfissao(items: number[]): string{
     const categoriasStrList: string[] = [];
     const categoriaObj = listaCategoria.filter(cat => items.includes(cat.value));
     categoriaObj.forEach(element => {
       categoriasStrList.push(element.label);
     });
     return categoriasStrList.join(", ");
    return "";
  }

  const[validaSenha, setValidaSenha] = useState(false);
  const[validaCategoria, setValidaCategoria] = useState(false);

  const onSubmit: SubmitHandler<ProfissionalForm> = async (data) => {

    setValidaSenha(false);
    setValidaCategoria(false);

    if(categorias.length <= 0){
        setValidaCategoria(true);
        return;
    }

    if(data.senha != data.confirmaSenha){
      setValidaSenha(true);
      return;
    }

      const idUsuario = profissional?.idusuario != undefined ? profissional.idusuario : 0;      

      const newUsuario: UsuarioSave = {
        id: idUsuario,
        nome: data.nome,
        email: data.email,
        dataCadastro: formatarData(new Date()),
        perfil: Perfil.Profissional,
        senha: data.senha,
        status: Status.Ativo,
      };

      const idProfissional = profissional?.id != undefined ? profissional.id : 0;

      let newProfissional: Profissional = {
        id: idProfissional,
        usuario: newUsuario,
        categorias: categorias,
        descricao: data.descricao,
        uriimagemprincipal: profissional?.uriimagemprincipal,   
        imagemPortifolios: [],  //TODO: VER COMO PASSAR AS IMAGENS
        telefone: data.telefone,
        disponibilidadeInicio: data.disponibilidadeInicio,
        disponibilidadeFim: data.disponibilidadeFim,
        avaliacaoMedia: profissional?.avaliacaoMedia || 0,
        profissao: preencheProfissao(categorias),
        servico: data.servico,
        rua: data?.rua,
        numero: data?.numero,
        bairro: data.bairro,
        // cep: "45500-000",
        estado: data.estado,
        cidade: data.cidade,
        latitude: "",
        status: isEnabled ? Status.Ativo : Status.Inativo,
      };

      salvaProfissaoApi(newProfissional);
  };

  async function salvaProfissaoApi(item: Profissional) {
    try{
      
      let response: RequestResponse = {} as RequestResponse;
  
      setLoading(true);
      if(item != undefined && item.id != undefined && item.id > 0){
        console.log("Atualizando profissional: " + JSON.stringify(item));
        response = await UpdateProfissional(item.id, item);
      }else{
        console.log("Salvando profissional: " + JSON.stringify(item));
        response = await SalvarProfissional(item);
      }
  
      console.log("response: " + JSON.stringify(response));

      setLoading(false);
       if(response.sucess){
          console.log("salvaProfissaoApi ENTROU");
          const newProfissional = response.objeto;
          item.usuario.id = response.id;
          console.log("newProfissional.usuario: " + JSON.stringify(newProfissional));
          saveUsuario("@usuario", newProfissional.usuario);
          setExisteUsuario(true);

          if(fotoPrincipal != null && fotoPrincipal != undefined){
            await preencheImagemPrincipal(newProfissional);
          }
          
          navigation.goBack();
       }else{
         setModalVisible(true);
         setModalMessage(response.message);
       }

      }catch(error){
          console.log("ERROR: " + error);
          setLoading(false);
      }
  }


  async function preencheImagemPrincipal(item: Profissional) {

    const extensao = fotoPrincipal.originalPath.slice(-3);
    const nomeImagem = `foto_${item.usuario.id}${item.id}.${extensao}`;

      const formData = new FormData();
      formData.append('imagem', {
        uri: fotoPrincipal.uri,
        type: `image/${extensao}`,
        name: nomeImagem,
      });
      formData.append("id", item.id);

      const response = await UpdateImagem(formData);
      console.log("response: " + JSON.stringify(response));
  }

    

  //** CATEGORIAS **/
  const [categorias, setCategorias] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [nomeCategorias, setNomeCategorias] = useState("");
  
  
  const [listaCategoria, setListaCategoria] = useState<CategoriaCombo[]>([]);
  useEffect(() => {
    const obterCategorias = async () => {
        try {          
           const response = await GetAllAtivos();
           formatarCategoria(response);  
        } catch (error) {
          console.log("Erro para obter as Categorias", error);
        }
      };
    obterCategorias();

    const verificarUsuario = async () => {
      try {
        const usuarioStorege = await getUsuario("@usuario");
        if (usuarioStorege) {

          setLoading(true);
          const objetoProfissional: any = await ObterProfissionalByUsuario(usuarioStorege.id);
          const profissional = objetoProfissional.objeto;
          profissional.id = profissional.idprofissional;
          // profissional.usuario.id = profissional.idusuario;
          setProfissional(profissional);

          console.log("PEGOU USUARIO: " + JSON.stringify(objetoProfissional));

          setValue("nome", usuarioStorege.nome);
          setValue("email", usuarioStorege.email);
          setValue("servico", objetoProfissional.objeto.servico);
          setValue("rua", objetoProfissional.objeto.rua);
          setValue("numero", objetoProfissional.objeto.numero);
          setValue("bairro", objetoProfissional.objeto.bairro);
          setValue("cidade", objetoProfissional.objeto.cidade);
          setValue("telefone", objetoProfissional.objeto.telefone);
          setValue("estado", objetoProfissional.objeto.estado);
          setValue("descricao", objetoProfissional.objeto.descricao);
          setValue("disponibilidadeInicio", objetoProfissional.objeto.disponibilidadeinicio);
          setValue("disponibilidadeFim", objetoProfissional.objeto.disponibilidadefim);

          setIsEnabled(objetoProfissional.objeto.status === Status.Ativo);

          obterCategoriasByProfissional(profissional.idprofissional);
          setLoading(false);

        }else{
          console.log("Erro ao obter usuário do storage");
        }
      } catch (error) {
        console.log("Erro ao obter usuário do storage:", error);
        setLoading(false);
      }
    };
    verificarUsuario();

    const obterCategoriasByProfissional = async (idProfissional: number) => {
      try {          
          if(idProfissional != null && idProfissional > 0){
            const response: any[] = await ObterTodosByProfissional(idProfissional);
            const listaCategoriaProfissional: number[] = [];
            response.forEach(element => {
              listaCategoriaProfissional.push(element.idcategoria)
            });
            setCategorias(listaCategoriaProfissional)
          }
        } catch (error) {
          console.log("Erro para obter as Categorias por usuario", error);
        }
    };
    
      
  }, []);


  function formatarCategoria(categorias: any[]){
    const categoriasFormatadas: any[] = [];
    categorias.forEach(element => {
      categoriasFormatadas.push({label: element.nome, value: element.idcategoria});
    });
    setListaCategoria(categoriasFormatadas);
  }

  //** CATEGORIAS FIM **/
  

  async function excluirFoto(){
    if(profissional != null && profissional != undefined){
      console.log("excluirFoto: " + profissional.id);
      const response = await deleteFoto(profissional.id);
      console.log("EXCLUIR FOTO: " + JSON.stringify(response));
      setProfissional({ ...profissional, uriimagemprincipal: '' });
      setModalConfirmacaoVisible(false)
    }
  }

  async function modalExcluirFotoPrincipal() {
    setModalConfirmacaoVisible(true);
  }

  async function mostraNomeCategoria(){
    setOpen(false);
    setNomeCategorias("");
    const categoriasSelecionadas = listaCategoria.filter(cat => categorias.includes(cat.value));
    const nomesCategorias = categoriasSelecionadas.map(cat => cat.label);
    const nomes =  nomesCategorias.join(", ");
    setNomeCategorias(nomes);
  }

  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  const formItems = [
    { key: 'logo', render: () => (
      <View style={styles.header}>
              <Image source={require('../../assets/image/logo.png')} style={[globalStyles.logo]} />
              {/* <Text style={styles.greeting}>Olá, Leandro!</Text> */}
            </View>
    )},
    { key: 'fotoPrincipal', render: () => (
    <View style={styles.container}>
    <TouchableOpacity style={styles.photoButton} onPress={escolherImagem}>
        <Text style={styles.photoText}>Adicionar Foto Principal</Text>
    </TouchableOpacity>

    {fotoPrincipal && 
      <View style={styles.fotoPrincipal}>
          {fotoPrincipal &&
            <Image
            source={fotoPrincipal}
            style={styles.preview}
            />
          }
      </View>
    }

      <View style={styles.fotoPrincipal}>
        {profissional?.uriimagemprincipal && !fotoPrincipal &&
            <Image
            source={{uri: `${profissional?.uriimagemprincipal}?t=${Date.now()}`}}
            style={styles.preview}
            />
        }
        </View>

        {profissional?.uriimagemprincipal && !fotoPrincipal &&
            <View style={styles.excluifoto}>
                <TouchableOpacity style={[styles.buttonremover, styles.cancel]} onPress={modalExcluirFotoPrincipal}>
                    <Text style={styles.buttonText}><Icon name="delete" size={17} color="#FFF" />  Apagar</Text>
                </TouchableOpacity>
            </View>
        }


    
    </View>
    )},
    { key: 'nome', render: () => (
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
    )},
    { key: 'email', render: () => (
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
    )},
    { key: 'categoria', render: () => (
      <View>
        <DropDownPicker
          open={open}
          value={categorias}
          items={listaCategoria}
          setOpen={setOpen}
          setValue={setCategorias}
          setItems={setListaCategoria}
          style={styles.input}
          multiple={true}
          min={1}
          max={5}
          translation={{
            PLACEHOLDER: "Selecione uma ou mais Categorias",
            SEARCH_PLACEHOLDER: "Digite para buscar...",
            SELECTED_ITEMS_COUNT_TEXT: "{count} Categorias selecionadas",
          }}
          dropDownContainerStyle={{ maxHeight: 300 }}
          searchable={true}
          listMode="SCROLLVIEW"
        />

        <Text>{nomeCategorias}</Text>

        <View style={styles.msgErro}>{validaCategoria && <Text style={styles.textErro}>Selecione pelo menos uma Categoria</Text>}</View>
      </View>
    )},
    { key: 'servico', render: () => (
      <Controller
        control={control}
        name="servico"
        render={({ field: { onChange, value } }) => (
          <>
              <TextInput
                style={styles.input}
                placeholder="Serviços Oferecidos, separe por vírgula cada serviço. Ex: Reforma de Roupa, Vestidos Sob Medida, etc"
                placeholderTextColor={colors.placeholdertext}
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={4}
                maxLength={400}
              />
            <View style={styles.msgErro}>{errors.servico && <Text style={styles.textErro}>{errors.servico.message}</Text>}</View>
          </>
        )}
      />

    )},
    // { key: 'portfolio', render: () => (
    // <View style={styles.container}>
    //   <TouchableOpacity style={styles.photoButton} onPress={escolherImagemPortifolio}>
    //     <Text style={styles.photoText}>Adicionar Imagem ao Portfólio</Text>
    //   </TouchableOpacity>
    //       <FlatList
    //         style={styles.container}
    //         data={listaPortifolio}
    //         renderItem={({ item }) => 
    //               <View style={styles.fotoPortifolio}>
    //                   <Image
    //                       source={{ uri: item.uri }}
    //                       style={styles.preview}
    //                   />
    //               </View>    
    //           }
    //           // keyExtractor={item => String(item.id)}
    //           horizontal
    //           showsHorizontalScrollIndicator={false}
    //       />
    // </View>
    // )},
    { key: 'telefone', render: () => (
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInputMask
              type={'cel-phone'}
              style={styles.input}
              placeholder="Telefone — (99) 99999-9999"
              placeholderTextColor={colors.placeholdertext}
              keyboardType="phone-pad"
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              value={value}
              onChangeText={onChange}
              maxLength={15}
            />
            <View style={styles.msgErro}>{errors.telefone && <Text style={styles.textErro}>{errors.telefone.message}</Text>}</View>
          </>
        )}
      />
    )},
    { key: 'endereco', render: () => (
        <View style={styles.row}>
          <View style={{width: '75%'}}>
            <Controller
              control={control}
              name="rua"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[styles.input]}
                    placeholder="Endereco"
                    value={value}
                    placeholderTextColor={colors.placeholdertext}
                    onChangeText={onChange}
                    maxLength={150}
                  />
                  <View style={styles.msgErro}>{errors.rua && <Text style={styles.textErro}>{errors.rua.message}</Text>}</View>
                </>
              )}
            />
          </View>
          
          <View style={{width: '20%'}}>
          <Controller
            control={control}
            name="numero"
            render={({ field: { onChange, value } }) => (
              <>
                  <TextInput
                    style={styles.input}
                    placeholder="Número"
                    value={value}
                    placeholderTextColor={colors.placeholdertext}
                    onChangeText={onChange}
                    maxLength={10}
                  />
                <View style={styles.msgErro}>{errors.numero && <Text style={styles.textErro}>{errors.numero.message}</Text>}</View>
              </>
            )}
          />
          </View>       
        </View>
    )},
    { key: 'cidade', render: () => (
        <View style={styles.row}>
          <View style={{width: '37%'}}>
            <Controller
              control={control}
              name="bairro"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={[styles.input]}
                    placeholder="Bairro"
                    value={value}
                    placeholderTextColor={colors.placeholdertext}
                    onChangeText={onChange}
                    maxLength={150}
                  />
                  <View style={styles.msgErro}>{errors.bairro && <Text style={styles.textErro}>{errors.bairro.message}</Text>}</View>
                </>
              )}
            />
          </View>
          
          <View style={{width: '37%'}}>
          <Controller
            control={control}
            name="cidade"
            render={({ field: { onChange, value } }) => (
              <>
                  <TextInput
                    style={styles.input}
                    placeholder="Cidade"
                    value={value}
                    placeholderTextColor={colors.placeholdertext}
                    onChangeText={onChange}
                    maxLength={150}
                  />
                <View style={styles.msgErro}>{errors.cidade && <Text style={styles.textErro}>{errors.cidade.message}</Text>}</View>
              </>
            )}
          />
          </View> 

          <View style={{width: '20%', zIndex: 2000}}>
            <Controller
                control={control}
                name="estado"
                render={({ field: { onChange, value } }) => (
                  <>
                    <DropDownPicker
                      style={styles.input}
                      open={openCidade}
                      value={value}
                      items={cidades}
                      setOpen={setOpenCidade}
                      setValue={(callback) => {
                        // DropDownPicker passa uma função callback que retorna o novo array
                        const selected = callback(value); 
                        onChange(selected); // atualiza o RHF com o array correto
                      }}
                      setItems={setCidades}
                      placeholder="UF"
                      dropDownContainerStyle={{ maxHeight: 300 }}
                      searchable={false}
                      listMode="SCROLLVIEW"
                    />
                <View style={styles.msgErro}>{errors.estado && <Text style={styles.textErro}>{errors.estado.message}</Text>}</View>
              </>
            )}
          />

          </View> 


        </View>

        
    )},
    { key: 'descricao', render: () => (
      <Controller
        control={control}
        name="descricao"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Sobre Mim — Fale um pouco sobre sua experiência e habilidades."
              value={value}
              placeholderTextColor={colors.placeholdertext}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              maxLength={400}
            />
            <View style={styles.msgErro}>{errors.descricao && <Text style={styles.textErro}>{errors.descricao.message}</Text>}</View>
          </>
        )}
      />
    )},
    { key: 'horario', render: () => (
      <View>
        <Text style={styles.sectionTitle}>Horário de Atendimento</Text>
        <View style={styles.row}>
          <View style={{width: '45%'}}>
            <Controller
              control={control}
              name="disponibilidadeInicio"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInputMask
                    placeholder="de"
                    type={'datetime'}
                    options={{ format: 'HH:mm' }}
                    value={value}
                    placeholderTextColor={colors.placeholdertext}
                    onChangeText={onChange}
                    style={[styles.input, styles.timeInput]}
                    maxLength={5}
                  />
                  <View style={styles.msgErro}>{errors.disponibilidadeInicio && <Text style={styles.textErro}>{errors.disponibilidadeInicio.message}</Text>}</View>
                </>
              )}
            />
          </View>
          
          <View style={{width: '45%'}}>
          <Controller
            control={control}
            name="disponibilidadeFim"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInputMask
                  placeholder="até"
                  type={'datetime'}
                  options={{ format: 'HH:mm' }}
                  value={value}
                  placeholderTextColor={colors.placeholdertext}
                  onChangeText={onChange}
                  style={[styles.input, styles.timeInput]}
                  maxLength={5}
                />
                <View style={styles.msgErro}>{errors.disponibilidadeFim && <Text style={styles.textErro}>{errors.disponibilidadeFim.message}</Text>}</View>
              </>
            )}
          />
          </View>
        
        </View>
      </View>
    )},
    { key: 'senha', render: () => (
      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange, value } }) => (
          <>

  <View style={styles.inputContainer}>
      <TextInput
          style={styles.input2}
          placeholder="Senha"
          value={value}
          placeholderTextColor={colors.placeholdertext}
          onChangeText={onChange}
          secureTextEntry={secureSenha}
      />
      <TouchableOpacity onPress={() => setSecureSenha(!secureSenha)}>
        <Icon
          name={secureSenha ? "remove-red-eye" : "lock"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
    </View>


            <View style={styles.msgErro}>{errors.senha && <Text style={styles.textErro}>{errors.senha.message}</Text>}</View>
          </>
        )}
      />
    )},
    { key: 'confirmaSenha', render: () => (
      <Controller
        control={control}
        name="confirmaSenha"
        render={({ field: { onChange, value } }) => (
          <>



  <View style={styles.inputContainer}>
      <TextInput
              style={styles.input2}
              placeholder="Confirma Senha"
              value={value}
              placeholderTextColor={colors.placeholdertext}
              onChangeText={onChange}
              secureTextEntry={secureSenha}
      />
      <TouchableOpacity onPress={() => setSecureSenha(!secureSenha)}>
        <Icon
          name={secureSenha ? "remove-red-eye" : "lock"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
    </View>



            <View style={styles.msgErro}>{errors.confirmaSenha && <Text style={styles.textErro}>{errors.confirmaSenha.message}</Text>}</View>
            <View style={styles.msgErro}>{validaSenha && <Text style={styles.textErro}>As senhas estão diferente</Text>}</View>
          </>
        )}
      />
    )},
    { key: 'status', render: () => (
      <View style={[{ flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 10, paddingBottom: 10 }]}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Text>{isEnabled ? 'Conta Ativa' : 'Conta Desativada'}</Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1}}>
          <Switch
            trackColor={{ false: '#b9b6bd', true: '#b9b6bd' }}
            thumbColor={isEnabled ? '#25D366' : '#E74C3C'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
    )},
    { key: 'botoes', render: () => (
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Salvar Cadastro</Text>
        </TouchableOpacity>
      </View>
    )},
    { key: 'termos', render: () => (
       <Text style={styles.termos}>
        Ao cadastrar-se, você concorda com os{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('TermosDeUso')}
        >
          Termos de Uso
        </Text>{' '}
        e{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('PoliticaPrivacidade')}
        >
          Política de Privacidade
        </Text>.
      </Text>
    )},
  ];



  return (

      <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >

             <TouchableWithoutFeedback
                onPress={() => { mostraNomeCategoria(); }}
              >

                  <View style={styles.container}> 

                      <Modal visible={modalConfirmacaoVisible} animationType='fade' transparent={true}>
                        <ModalConfirmacao mensagem={'Apagar foto principal?'} 
                                          handleConfirmacao={() => excluirFoto()} 
                                          handleClose={() => setModalConfirmacaoVisible(false)} >
                        </ModalConfirmacao>
                      </Modal>
                          
                      <Modal visible={modalVisible} animationType='fade' transparent={true}>
                          <ModalMensagem handleClose={() => setModalVisible(false)} type={'error'} message={modalMessage} ></ModalMensagem>          
                      </Modal>

                      <FlatList
                        data={formItems}
                        renderItem={({ item }) => item.render()}
                        keyExtractor={(item) => item.key}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 300 }}
                        keyboardDismissMode="on-drag"
                      />
                  <LoadingModal visible={loading} />
                  </View>

          
          </TouchableWithoutFeedback>

      </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
categoryCard: {
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
    width: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#392de9',
    textAlign: 'center',
  },
  photoButton: {
    backgroundColor: '#EEE',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  photoText: {
    color: '#555',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
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
   preview: { 
    width: 150, 
    height: 150, 
    marginTop: 16, 
    borderRadius: 8, 
  },
   fotoPrincipal:{
    alignItems: 'center',
   },
   fotoPortifolio: {
    padding: 16,
    elevation: 4,
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
    marginBottom: 5,
    backgroundColor: '#F9F9F9',
    color: colors.text
  },
  textErro: {
  color: colors.formerro,
  },
  msgErro: {
    marginBottom: 15,
  },
  excluifoto: {
    paddingTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  buttonremover: {
    padding: 8,
    width: '80%',
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
   inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input2: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  termos: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
});
