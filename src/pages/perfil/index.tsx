import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, ImageSourcePropType, Modal, Alert } from 'react-native';
import { colors } from '../../assets/css/globalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ModalAvaliacao } from '../../components/modalAvaliacao';
import { Avaliacao } from '../../model/Avaliacao';
import { Portifolio } from '../../model/Portifolio';
import { useUserStore } from '../../utils/userStore';
import { useFocusEffect, RouteProp, useRoute} from '@react-navigation/native';
import useStorege from '../../hooks/useStorege';
import { ObterProfissionalCard, ObterPerfil } from '../../api/ProfissionalController';
import { ObterFavorito, FavoritarProfissional } from '../../api/UsuarioController';
import { ProfissionalCard } from '../../modelUtils/ProfissionalCard';
import { RequestResponse } from '../../modelUtils/RequestResponse';
import { RootStackParamList } from "../routes/types";
import { ProfissionalPerfil } from '../../modelUtils/ProfissionalPerfil';
import { BASE_URL, URL_IMG_PROFISSIONAL } from '@env'; 
import { openWhatsApp } from '../../utils/utils';
import { Favorito } from '../../model/Favorito';
import { ObterAvaliacaoByProfissional, SalvarAvaliacao, deleteAvaliacao } from '../../api/AvaliacaoController';
import { AvaliacaoResponse } from '../../modelUtils/AvaliacaoResponse';
import { formatarData } from '../../utils/utils';
import LoadingModal from '../../components/modalPreloader';
import { ModalConfirmacao } from '../../components/modalConfirmacao';

const sizeImageButton = 20;

export function PerfilProfissional() {

  const [mostraBtnEdicao, setMostraBtnEdicao] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { setExisteUsuario, existeUsuario } = useUserStore();
  const { getUsuario }  = useStorege();
  type PerfilProfissionalRouteProp = RouteProp<RootStackParamList, 'PerfilProfissional'>;
  const [loading, setLoading] = useState(false);
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  
  const [favorito, setFavorito] = useState<Favorito>({
    idusuario: 0,
    idprofissional: 0
  });

  type ItemServico = {
    id: number;
    nome: string ;
  };

  const [portifolio, setPortifolio] = useState<Portifolio[]>([]);

  
  const [servicos, setServicos] = useState<ItemServico[]>([]);

  function ajustaServicos(param: string): string[] {
    const servicosSplit = param.split(',');

    const listaFinal: ItemServico[] = [];
    servicosSplit.forEach((element, ind) => {
      const item: ItemServico = {
        id: ind,
        nome: element.trim(),
      };
      listaFinal.push(item);
    });

    setServicos(listaFinal);

    return servicosSplit;
  }


  const [avaliacao, setAvaliacao] = useState<Avaliacao[]>([]);
  const listaAvaliacoes: Avaliacao[] = [];



  const [profissionalAtual, setProfissionalAtual] = useState<ProfissionalPerfil>();

  const [coracao, setCoracao] = useState(false);
  async function favoritarCoracao(){
    const responseFavorito: RequestResponse = await FavoritarProfissional(favorito);
    setCoracao(responseFavorito.sucess);
  }



const route = useRoute<PerfilProfissionalRouteProp>();
const { id } = route.params;

useEffect(() => {
  // setPortifolio(listaPortfolio);
  // setAvaliacao(listaAvaliacoes);

}, [coracao, favorito]);

  function modalAvaliar() {
      setModalVisible(true);
  }

  async function salvarAvaliacao(item: Avaliacao) {

    const usuarioStorege = await getUsuario("@usuario");
    item.idusuario = usuarioStorege?.id || 0;
    item.idprofissional = profissionalAtual?.id || 0;
    item.data = formatarData(new Date());
    
    const response: RequestResponse =  await SalvarAvaliacao(item);
     if(response.sucess){
       atualizarAvaliacoes(profissionalAtual?.id || 0);
     }

      setModalVisible(false);
  }


  const atualizarAvaliacoes = async (id: number) => {
    try {
        const response: RequestResponse = await ObterAvaliacaoByProfissional(id);
        if (response.sucess) {

          const avaliacaoResponse: AvaliacaoResponse = response.objeto;
          const avaliacoes: Avaliacao[] = avaliacaoResponse.avaliacoes;


          const usuarioStorege = await getUsuario("@usuario");
          const idUsuarioAtual = usuarioStorege?.id || 0;

          avaliacoes.forEach((a) => {
            a.excluir = (a.idusuario === idUsuarioAtual);
          });

          setProfissionalAtual(prev => ({...prev!, avaliacaoMedia: avaliacaoResponse.estrela}));
          setAvaliacao(avaliacoes);      
            
          }else{
            console.log("Erro API: " + response.message);
          }
      } catch (error) {
        console.log("Erro ao obterProfissioaisCard: ", error);
      }
  }
  

  useFocusEffect(
      useCallback(() => {
        const verificarUsuario = async () => {
          try {
            const usuarioStorege = await getUsuario("@usuario");
            if (usuarioStorege) {
                setExisteUsuario(true);
              }else{
                console.log("Não achou usuario no storage");
                setExisteUsuario(false);
              }
          } catch (error) {
            console.log("Erro ao obter usuário do storage:", error);
          }
        };
        verificarUsuario();

        const obterProfissional = async () => {
          try {
              setLoading(true);
              const response: RequestResponse = await ObterPerfil(id);
              setLoading(false);
              if (response.sucess) {
                  const objeto: ProfissionalPerfil = response.objeto;
                  objeto.servicos = ajustaServicos(objeto.servico);
                  setProfissionalAtual(objeto);       

                  const usuarioStorege = await getUsuario("@usuario");
                  const idUsuario = usuarioStorege?.id || 0;
                  const idUsuarioProfissional = objeto?.idusuario || 0;
                  const idProfissional = objeto?.id || 0;

                  const verificaFavorito: Favorito = {idusuario: idUsuario , idprofissional: idProfissional};
                  setFavorito(verificaFavorito);
                  const responseFavorito: RequestResponse = await ObterFavorito(verificaFavorito);
                  if(responseFavorito.sucess){
                    setCoracao(true);
                  }else{
                    setCoracao(false);
                  }

                  atualizarAvaliacoes(idProfissional);
                  mostraEdicaoAvaliacao((idUsuario === idUsuarioProfissional));
                  
                }else{
                  console.log("Erro API: " + response.message);
                }
            } catch (error) {
              console.log("Erro ao obterProfissioaisCard: ", error);
              setLoading(false);
            }
        }
        obterProfissional();

        const mostraEdicaoAvaliacao = async (usuarioMesmoProfissional: boolean) =>{
            setMostraBtnEdicao(existeUsuario && !usuarioMesmoProfissional);
        }
      }, [])
    );


    async function handleExcluir() {
        setModalConfirmacaoVisible(false);
        if(idAvaliacaoExcluir){
          const response: RequestResponse =  await deleteAvaliacao(idAvaliacaoExcluir);
          console.log("response deleteAvaliacao: " + JSON.stringify(response));
          if(response.sucess){
            console.log("response deleteAvaliacao: " + profissionalAtual?.id + "   -   " + JSON.stringify(response));
            atualizarAvaliacoes(profissionalAtual?.id || 0);
          }
        }
    }

    const [idAvaliacaoExcluir, setIdAvaliacaoExcluir] = useState<number | null>(null);
    function modalExcluir(idAvaliacao?: number) {
      setModalConfirmacaoVisible(true);
      console.log("idavaliacao: " + idAvaliacao);
      setIdAvaliacaoExcluir(idAvaliacao || null);
     }

  return (
    <ScrollView style={styles.container}>

          <Modal visible={modalConfirmacaoVisible} animationType='fade' transparent={true}>
            <ModalConfirmacao mensagem={'Apagar avaliação?'} 
                              handleConfirmacao={() => handleExcluir()} 
                              handleClose={() => setModalConfirmacaoVisible(false)} >
            </ModalConfirmacao>
          </Modal>

      {/* Cabeçalho */}
      <View style={styles.header}>
          <Image 
              source={{uri: `${profissionalAtual?.uriimagemprincipal}`}} 
              style={styles.avatar} resizeMode='cover'/>
        <View style={styles.info}>
          <Text style={styles.nome}>{profissionalAtual?.nome}</Text>
          <Text style={styles.profissao}>{profissionalAtual?.categorias}</Text>
          <Text style={styles.local}>{profissionalAtual?.bairro} - {profissionalAtual?.cidade} - {profissionalAtual?.estado}</Text>
          <View style={styles.starHeader}>
              {Array.from({ length: profissionalAtual?.avaliacaoMedia || 0 }).map((_, i) => (
                <Text key={i}><Icon name="star" size={20} color="#FFD700" /></Text>
              ))}
          </View>
        </View>
          
      </View>

      {/* Botões de ação */}
      <View style={[styles.actions, styles.sombraBottom]}>
        <TouchableOpacity style={[styles.button, styles.whatsapp]} onPress={() => openWhatsApp(profissionalAtual?.telefone || "")}>          
          <Text style={styles.buttonText}><Icon name="whatsapp" size={sizeImageButton} color="#FFF" />   Mensagem</Text>
        </TouchableOpacity>
        {existeUsuario &&
        <TouchableOpacity style={[styles.button, styles.favorito]} onPress={favoritarCoracao}>
          {/* <Text style={styles.buttonText}>Adicionar aos Favoritos</Text> */}
          {coracao &&
              <Text style={styles.buttonText}><Icon name="heart" size={sizeImageButton} color="#FFF" />   Favoritar</Text>
          }
          {!coracao &&
              <Text style={styles.buttonText}><Icon name="heart-o" size={sizeImageButton} color="#FFF" />   Favoritar</Text>
          }
        </TouchableOpacity>
        }
      </View>

      {/* Sobre mim */}
      <View style={[styles.sombraBottom]}>
        <Text style={styles.sectionTitle}>Sobre Mim</Text>
        <Text style={styles.text}>
          {profissionalAtual?.descricao}
        </Text>
      </View>

      {/* Portfólio */}
      {/* <View style={styles.sombraBottom}>
        <Text style={styles.sectionTitle}>Portfólio</Text>
        <FlatList
          data={portifolio}
          horizontal
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Image source={{uri: item.uri}} style={styles.portfolioImage} />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View> */}

      {/* Serviços */}
      <View style={styles.sombraBottom}>
        <Text style={styles.sectionTitle}>Serviços</Text>
        {servicos.map((s) => (
          <Text key={s.id} style={styles.text}>• {s.nome}</Text>
        ))}
      </View>

      {/* Avaliações */}
      <View style={styles.avaliacao}>
        <Text style={styles.sectionTitle}>Avaliações</Text>
        {mostraBtnEdicao &&
          <TouchableOpacity style={styles.btnavaliacao} onPress={modalAvaliar}><Icon name="pencil-square-o" size={sizeImageButton} color="#fff" /></TouchableOpacity>
        }
      </View>

      <Modal visible={modalVisible} animationType='fade' transparent={true}>
        <ModalAvaliacao onSave={(data: any) => salvarAvaliacao(data)} handleClose={() => setModalVisible(false)} ></ModalAvaliacao>
      </Modal>

      {avaliacao.map((a) => (
        <View key={a.id} style={styles.review}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewNome}>
              {a.nome} – 
              {Array.from({ length: a.estrelas }).map((_, o) => (
                <Icon key={o} name="star" size={20} color="#FFD700" />
              ))}
            </Text>

            {a.excluir && (
              <TouchableOpacity onPress={() => modalExcluir(a.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.text}>{a.comentario}</Text>
          {/* <Text style={styles.reviewTempo}>{a.tempo}</Text> */}
        </View>
      ))}


      <Text style={styles.note}>
        Ao avaliar, você ajuda outros usuários a escolherem os melhores profissionais.
      </Text>
      <LoadingModal visible={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor:'#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 15},
  info: { flex: 1, width: '50%' },
  nome: { fontSize: 20, fontWeight: 'bold', color: '#0a4c96f7' },
  profissao: { fontSize: 16, color: '#0a4c96f7' },
  local: { fontSize: 14, color: '#0a4c96f7' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16 },
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: 'center', marginHorizontal: 4 },
  whatsapp: { backgroundColor: colors.btnwhatsapp },
  favorito: { backgroundColor: '#0a4c96f7' },
  addService: { backgroundColor: '#0a4c96f7', marginTop: 12 },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10, marginBottom: 8, color: '#0a4c96f7' },
  text: { fontSize: 14, color: '#0a4c96f7', marginBottom: 6 },
  portfolioImage: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  review: { marginBottom: 12 },
  reviewNome: { fontWeight: 'bold', color: '#0a4c96f7' },
  reviewTempo: { fontSize: 12, color: '#0a4c96f7' },
  note: { fontSize: 12, color: '#0a4c96f7', marginTop: 16, textAlign: 'center', paddingBottom: 80 },
  starHeader: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 20 },
  sombraBottom: {backgroundColor: '#fff',borderBottomWidth: 2, borderBottomColor: '#ccc', paddingBottom: 8,},
  btnavaliacao: { fontSize: 13, marginTop: 10, marginBottom: 8, color: '#fff', backgroundColor: '#0a4c96f7', padding: 8, alignItems: 'center', borderRadius: 5,  },
  avaliacao:{flexDirection: 'row', justifyContent: 'space-between',},
  avatar: {
    width: 190,
    height: 160,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // nome à esquerda, botão à direita
    alignItems: 'center',
    marginBottom: 4,
  },
});
