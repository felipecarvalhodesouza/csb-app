import Equipe from "./equipe";

export interface Atleta {
  id: number;
  nome: string;
  dataNascimento: Date;
  altura: number;
  peso: number;
  equipe: Equipe;
}