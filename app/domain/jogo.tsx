import Categoria from "./categoria";
import Equipe from "./equipe";

export default interface Jogo {
    id: number;
    data: string;
    categoria: Categoria;
    mandante: Equipe;
    visitante: Equipe;
    eventos: any[];
    transmissao: string;
}