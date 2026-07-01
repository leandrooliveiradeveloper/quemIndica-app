export const formatarData = (data: Date): string => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(data);
  } catch (error) {
    console.log("Erro ao formatar Data", error);
    return "";
  }
};
