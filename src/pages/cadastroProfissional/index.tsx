import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, KeyboardAvoidingView, Platform, ImageSourcePropType } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
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


interface UsuarioForm {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
}


interface ProfissionalForm {
  // uriImagemPrincipal: ImageSourcePropType;
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
  // categoria: number[];

  // id: number;
    // usuario: Usuario;
    // categorias: Categoria[];
    // imagemPortifolios: Portifolio[];
    // profissao: string;

    
    
    // cep: string;
    // latitude: string;
}

const schema = Yup.object().shape({
  nome: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  servico: Yup.string().required('serviço é obrigatório, por favor separe por vírgula (",")'),
  telefone: Yup.string().required('Telefone é obrigatório'),
  descricao: Yup.string().required('Descição é obrigatório'),
  senha: Yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmaSenha: Yup.string().required('Confirmação de senha é obrigatória').min(6, 'Confirmação de senha deve ter pelo menos 6 caracteres'),
  disponibilidadeInicio: Yup.string().required('Horário inicial obrigatório'),
  disponibilidadeFim: Yup.string().required('Horário final obrigatório'),
  // rua: Yup.string().required('Endereço é obrigatório'),
  // numero: Yup.string().required('Obrigatório'),
  bairro: Yup.string().required('Bairro é Obrigatório'),
  cidade: Yup.string().required('Cidade é Obrigatório'),
  estado: Yup.string().required('Obrigatório'),
  // categoria: Yup.array()
  //   .of(Yup.number().required())
  //   .min(1, "Selecione pelo menos uma categoria")
  //   .max(5, "Máximo de 5 categorias")
  //   .required("Categoria é obrigatória"),
});


export function CadastroForm() {

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

  const[fotoPrincipal, setFotoPrincipal] = useState(null);

  const[listaPortifolio, setListaPortifolio] = useState<Portifolio[]>([]);

  const [open, setOpen] = useState(false);
  const [listaCategoria, setListaCategoria] = useState([
    {label: 'Eletricistas', value: 1},
    {label: 'Encanadores', value: 2},
    {label: 'Pintores', value: 3},
    {label: 'Costureiras', value: 5},
    {label: 'Jardineiros', value: 6},
    {label: 'Pedreiros', value: 7},
    {label: 'Manicures', value: 8},
    {label: 'Fotógrafos', value: 9},
    {label: 'Limpeza residencial', value: 10},
    {label: 'Jardinagem', value: 11},
    {label: 'Paisagismo', value: 12},
    {label: 'Pintura', value: 13},
    {label: 'Gesseiro', value: 14},
    {label: 'Carpintaria', value: 15},
    {label: 'Chaveiro', value: 16},
    {label: 'Dedetização', value: 17},
    {label: 'Cabeleireiro', value: 18},
    {label: 'Yoga', value: 19},
    {label: 'Idiomas', value: 20},
  ]);
  
  const navigation = useNavigation();

  const escolherImagem = () => {
    try{
        launchImageLibrary(
            { mediaType: 'photo', includeBase64: true }, // includeBase64 pega os bytes
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    const asset: any = response.assets[0];
                    // const profissionaAsset: ProfissionalForm = {uriImagemPrincipal: asset};
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
                    const asset: any = response.assets[0];
                    const portifolioAsset: Portifolio = {id: 3, uri: asset};
                    setListaPortifolio((prev) => [...prev, portifolioAsset]);
                }
            }
        );
    }catch(error){
        console.log("REACT ERRO: " + error);
    }

  };

  const { control, handleSubmit, formState: { errors } } = useForm<ProfissionalForm>({
    resolver: yupResolver(schema),
  });

  function preencheProfissao(items: number[]): string{
    const categoriasStrList: string[] = [];
    const categoriaObj = listaCategoria.filter(cat => items.includes(cat.value));
    categoriaObj.forEach(element => {
      categoriasStrList.push(element.label);
    });
    return categoriasStrList.join(", ");
  }

  const[validaSenha, setValidaSenha] = useState(false);
  const[validaCategoria, setValidaCategoria] = useState(false);

  const onSubmit: SubmitHandler<ProfissionalForm> = (data) => {

    setValidaSenha(false);
    setValidaCategoria(false);

    console.log(categorias);
    if(categorias.length <= 0){
        setValidaCategoria(true);
        return;
    }


    if(data.senha != data.confirmaSenha){
      setValidaSenha(true);
      return;
    }

    const idUsuario = profissional?.usuario?.id != undefined ? profissional.usuario.id : 0;      

      const newUsuario: Usuario = {
        id: idUsuario,
        nome: data.nome,
        email: data.email,
        dataCadastro: new Date(),
        perfil: Perfil.Profissional,
        senha: data.senha,
        status: Status.Ativo,
      };

      const idProfissional = profissional?.id != undefined ? profissional.id : 0;

      const newProfissional: Profissional = {
        id: idProfissional,
        usuario: newUsuario,
        categorias: categorias,
        descricao: data.descricao,
        uriImagemPrincipal: "https://media.istockphoto.com/id/1252338682/pt/foto/female-chef-is-preparing-a-flamb%C3%A9-specialty.jpg?s=612x612&w=0&k=20&c=98zSrE1RIcKycUAvbZsKmOw1QjAIPZmF0JqrqwTYa1w=",   //TODO: VER COMO PASSAR A IMAGEM
        imagemPortifolios: [],                                                                                                                                                                              //TODO: VER COMO PASSAR AS IMAGENS
        telefone: data.telefone,
        disponibilidadeInicio: data.disponibilidadeInicio,
        disponibilidadeFim: data.disponibilidadeFim,
        avaliacaoMedia: 0,
        profissao: preencheProfissao(categorias),
        servico: data.servico,
        rua: data?.rua,
        numero: data?.numero,
        bairro: data.bairro,
        // cep: "45500-000",
        estado: data.estado,
        cidade: data.cidade,
        latitude: "",
      };

      console.log('Dados enviados:', newProfissional);
  };


  const [categorias, setCategorias] = useState([]);


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
    { key: 'portfolio', render: () => (
    <View style={styles.container}>
      <TouchableOpacity style={styles.photoButton} onPress={escolherImagemPortifolio}>
        <Text style={styles.photoText}>Adicionar Imagem ao Portfólio</Text>
      </TouchableOpacity>

        {listaPortifolio.length > 0 && 
          <FlatList
            style={styles.container}
            data={listaPortifolio}
            renderItem={({ item }) => 
                  <View style={styles.fotoPortifolio}>
                      <Image
                          source={{ uri: item.uri }}
                          style={styles.preview}
                      />
                  </View>    
              }
              keyExtractor={item => String(item.id)}
              horizontal
              showsHorizontalScrollIndicator={false}
          />
        }

    </View>


    )},
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
                    maxLength={150}
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

          <View style={{width: '20%'}}>
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
                    placeholder="Das"
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
                  placeholder="Até"
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
    )},
    { key: 'confirmaSenha', render: () => (
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
      <Text style={styles.terms}>
        Ao cadastrar-se, você concorda com os Termos de Uso e Política de Privacidade.
      </Text>
    )},
  ];

  return (




    <FlatList
      style={styles.container}
      data={formItems}
      renderItem={({ item }) => item.render()}
      keyExtractor={(item) => item.key}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 300 }}
      keyboardDismissMode="on-drag"
    />




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
    paddingBottom: 40,
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
    width: 200, 
    height: 200, 
    marginTop: 16, 
    borderRadius: 8 },
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
});
