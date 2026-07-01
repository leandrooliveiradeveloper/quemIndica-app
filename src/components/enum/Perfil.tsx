export enum Perfil {
  Cliente = 1,
  Profissional = 2,
  Admin = 3,
}

function mostrarPerfil(perfil: Perfil) {
  console.log("perfil atual:", perfil);
}
