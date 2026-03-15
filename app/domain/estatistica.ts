export type EstatisticaTipo =
    | "ASSIST"
    | "REBOTE"
    | "ROUBO"
    | "TOCO"
    | "FALTA"
    | "FALTA_1"
    | "FALTA_2"
    | "FALTA_3"
    | "FALTA_TECNICA"
    | "FALTA_ANTIDESPORTIVA"
    | "FALTA_ANTIDESPORTIVA_2"
    | "FALTA_ANTIDESPORTIVA_3"
    | "FALTA_DESQUALIFICANTE"
    | "SUBSTITUICAO_IN"
    | "SUBSTITUICAO_OUT"
    | "ERRO"
    | "FIM_QUARTO"
    | "FIM_JOGO"
    | "INICIO_JOGO"
    | "C1" // Falta técnica do técnico
    | "B1" // Falta técnica do banco;
    | "TEMPO"

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
        case "faltas1":
            return "FALTA_1";
        case "faltas2":
            return "FALTA_2";
        case "faltas3":
            return "FALTA_3";
        case "ft":
            return "FALTA_TECNICA";
        case "fad1":
            return "FALTA_ANTIDESPORTIVA";
        case "fad2":
            return "FALTA_ANTIDESPORTIVA_2";
        case "fad3":
            return "FALTA_ANTIDESPORTIVA_3";
        case "fd":
            return "FALTA_DESQUALIFICANTE";
        case "c1":
            return "C1";
        case "b1":
            return "B1";
        case "substituicao_in":
            return "SUBSTITUICAO_IN";
        case "substituicao_out":
            return "SUBSTITUICAO_OUT";
        case "erro":
            return "ERRO";
        case "fim_quarto":
            return "FIM_QUARTO";
        case "fim_jogo":
            return "FIM_JOGO";
        case "inicio_jogo":
            return "INICIO_JOGO";
        case "tempo":
            return "TEMPO";

        default:
            throw new Error(`EstatisticaTipo desconhecido para o stat: ${stat}`);
    }
}
