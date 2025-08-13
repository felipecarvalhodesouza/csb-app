export type EstatisticaTipo =
  | "ASSIST"
  | "REBOTE"
  | "ROUBO"
  | "TOCO"
  | "FALTA"
  | "SUBSTITUICAO_IN"
  | "SUBSTITUICAO_OUT"
  | "ERRO"
  | "FT"
  | "FAD"
  | "FIM_QUARTO"

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
            return "FT";
        case "fad":
            return "FAD";
        case "fim_quarto":
            return "FIM_QUARTO";
        default:
            throw new Error(`EstatisticaTipo desconhecido para o stat: ${stat}`);
    }
}
