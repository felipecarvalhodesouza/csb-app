import Categoria from "./categoria";
import Equipe from "./equipe";
import Local from "./local";

export default interface Jogo {
    id: number;
    data: string;
    categoria: Categoria;
    mandante: Equipe;
    visitante: Equipe;
    local: Local;
    eventos: any[];
    transmissao: string;
    pontuacaoMandante: number;
    pontuacaoVisitante: number;
}