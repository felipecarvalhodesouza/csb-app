export type EstatisticaTipo =
  | "ASSIST"
  | "REBOTE"
  | "ROUBO"
  | "TOCO"
  | "FALTA"
  | "SUBSTITUICAO_IN"
  | "SUBSTITUICAO_OUT"
  | "ERRO"
  | "FALTA_TECNICA"
  | "FALTA_ANTIDESPORTIVA"
  | "FIM_QUARTO"
  | "FIM_JOGO"
  | "INICIO_JOGO";

export function getEstatisticaPorAthlete(stat: string): EstatisticaTipo {
    switch (stat.toLowerCase()) {
        case "assistencias":
            return "ASSIST";
        case "rebotes":
            return "REBOTE";
        case "roubos":
            return "ROUBO";
        case "tocos":
            return "TOCO";
        case "faltas":
            return "FALTA";
        case "substituicao_in":
            return "SUBSTITUICAO_IN";
        case "substituicao_out":
            return "SUBSTITUICAO_OUT";
        case "erro":
            return "ERRO";
        case "ft":
            return "FALTA_TECNICA";
        case "fad":
            return "FALTA_ANTIDESPORTIVA";
        case "fim_quarto":
            return "FIM_QUARTO";
        case "fim_jogo":
            return "FIM_JOGO";
        case "inicio_jogo":
            return "INICIO_JOGO";
        default:
            throw new Error(`EstatisticaTipo desconhecido para o stat: ${stat}`);
    }
}
