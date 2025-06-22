import Torneio from "./torneio";

export default interface Categoria {
    id?: number;
    nome?: string | null;
    torneio?: Torneio | null;
    equipes?: any | null;
}