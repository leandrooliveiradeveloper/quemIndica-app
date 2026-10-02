@ -2,96 +2,32 @@ This is a new [**React Native**](https://reactnative.dev) project, bootstrapped

# Getting Started
npm run android dev

# referencia
https://www.youtube.com/watch?v=V3PUGubaSQo&list=PLnex8IkmReXwCyR-cGkyy8tCVAW7fGZow&index=2

# ver os logs
Dentro da pasta .android rodar:     npx react-native log-android

To start the Metro dev server, run the following command from the root of your React Native project:
# icones
--icones
https://oblador.github.io/react-native-vector-icons/?utm_source=copilot.com
--icones
https://oblador.github.io/react-native-vector-icons/?utm_source=copilot.com#FontAwesome
https://www.flaticon.com/free-icon/growth_4185383?related_id=4185383&origin=pack

# rodar o projeto API junto com o app localmente
adb devices
adb -s ZF524WXRF5 reverse tcp:3000 tcp:3000

# gerar icones para o app
https://icon.kitchen/
https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=image&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(68%2C%20138%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher

## Step 2: Build and run your app
cd C:\Particular\Projetos\ProjetoQuemIndica\App\android
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
./gradlew assembleRelease

$env:ENVFILE = ".env.production"
npx react-native run-android --variant=release

# Instalar no celular
adb install -r android/app/build/outputs/apk/release/app-release.apk

# acessar o banco remoto pelo powershell
Acessar pelo PowerShell
psql "postgresql://quemindica_user:4CDVTnBTYM4Xn2o9p0QupXgG7XYnuqXr@dpg-dau1oo6k1f9s73a18ql0-a.oregon-postgres.render.com/quemindica"

///TODO:


1 - Ver como levar a imagem do aplicativo para a pasta no servidor  pasta "IdUsuario/foto_1.jpg", uma pasta pro usuário no servidor máximo 3 fotos de Portifólio
1.2 - Aparecer foto do Portifólio assim que adicionar                           --

8 - Criar na API uma site Admin para cadastro e relatórios

10 - Ajustar as cores do Aplicativo e o header
13 - Colocar contador para a quantidade de vezes que clicaram no Perfil


--*********  LISTA  ***********--
9 - Ver de não piscar as imagens quando recarregar a tela
10 - ver a tela de splash que está cortada
14 - ver a opçao de clicar no card pra abrir o perfil do profissional
16 - Fazer algum padrão para a senha do app
17 - na Edição de Perfil ver pq não consegue mudar de email -- precisa mudar de email



--*********  TRABALHANDO  ***********--


--*********  FEITO  ***********--

1 - Hora no cadastro do profissional não foi obrigatório
6 - formatar a hora de atendimento para não colocar hora aleatória
8 - No atlerar senha, quando alterou e clicou no modal a tela continuou na mesmoa, não foi pra tela de perfil
1 - Cadastro descer a tela para mostrar o botão com o fomulário, alterar senha
2 - as categorias estao aparecendo mesmo as desativadas
3 - quando marca a categoria as vezes não aparece
12 - arrastar para baixo para atualizar
15 - quando recuperar a senha mostrar a modal informando que irá receber um email de recuperação  --- CONFIRMAR QUE RECEBEU O EMAIL
16 - Ao cicar fora da combo de categoria não está fechando a combo
5 - o UF está aparecendo emcima da combo categoria quando abre a categoria
4 - Mostrar o nome das categorias em cima para ver o que foi selecionado
7 - Botar botão para mostrar senha ou mostrar pelo menos a última cadastrada
13 - Na pesquisa de profissionais buscar tanto pela categoria quanto pelo nome do profissional
11 - Excluir a avaliação pelo próprio usuário que cadastrou

1 - Quantidade de cliques nos prifissionais para selecionar os mais indicados
1 - Profissional pode ativar ou desativar o Profissional
2 - Link para termos de uso e termos de privacidade
18 - opção do usuário poder excluir o usuário (Desativar)
19 - Criar botão de compartilhamento do usuário para um profissional ainda não cadastrado

1 - O preloader quando salva o Usuário/Profissional está fechando o "preloader" antes da hora                                    
2 - Ao salvar o Profissional sem mexer na foto a foto está sendo apagado na coluna "uriimagemprincipal" mas não apaga do banco      -