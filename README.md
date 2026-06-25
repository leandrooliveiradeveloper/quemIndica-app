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
adb -s ZF524WXRF5 reverse tcp:3000 tcp:3000

# gerar icones para o app
https://icon.kitchen/
https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=image&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(68%2C%20138%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher

## Step 2: Build and run your app
cd C:\Particular\Projetos\ProjetoQuemIndica\App\android
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
./gradlew assembleRelease








///TODO:

1 - Criar tela de Login com o método preenchendo o objeto no cadastro de profissional
2 - Criar tela de Login com o método preenchendo o objeto no cadastro de usuario
3 - Ver como validar os campos e validar os campos obrigatórios

3 - Criar a tela de login gravando o usuário no "Dispositivo" para consultas futuras
4 - Criar as chamadas da API passando o bojeto Mockado
5 - Levar o Objeto/Id do objeto para a tela de detalhe
6 - Ver como levar a imagem do aplicativo para a pasta no servidor  pasta "IdUsuario/foto_1.jpg", uma pasta pro usuário no servidor máximo 3 fotos de Portifólio

7 - Criar as APIs no projeto API
7.1 - Criar API de login
7.1.1 - Criar hash para gravar senha do usuário

8 - Criar na API uma site Admin para cadastro e relatórios
9 - Ver onde pegar as imagens de profissões nas Categorias, ou então criar pela IA e ir subindo para o Servidor.

10 - Ajustar as cores do Aplicativo e o header
11 - Botão de "Esqueci senha"



