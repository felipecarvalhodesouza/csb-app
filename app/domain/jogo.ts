import { Atleta } from "./atleta";
import Categoria from "./categoria";
import Equipe from "./equipe";
import Evento from "./evento";
import Local from "./local";

export default interface Jogo {
    id: number;
    data: string;
    categoria: Categoria;
    mandante: Equipe;
    visitante: Equipe;
    local: Local;
    eventos: Evento[];
    streamUrl: string;
    placarMandante: number;
    placarVisitante: number;
    periodo: string;
    status: string;
    atletasMandante: Atleta[];
    atletasVisitante: Atleta[];
    arbitroPrincipal: any;
    arbitroAuxiliar: any;
    mesario: any;
    estatistico: any;
}