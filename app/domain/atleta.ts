import Equipe from "./equipe";

export interface Atleta {
  id: number;
  nome: string;
  dataNascimento: Date;
  altura: number;
  peso: number;
  equipe: Equipe;
  numero: string;
  titular: boolean;
  convocado: boolean;
  emQuadra: boolean;
}