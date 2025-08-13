import Equipe from "./equipe";

export interface Atleta {
  id: number;
  nome: string;
  numero: number;
  dataNascimento: Date;
  altura: number;
  peso: number;
  equipe: Equipe;

  // Estatísticas do atleta
  equipeId: number
  teamId: 'mandante' | 'visitante'
  numeroCamisaJogo: number;
  titular: boolean;
  convocado: boolean;
  emQuadra: boolean;
  expulso?: boolean;
  pontos: number;
  rebotes: number;
  assistencias: number;
  roubos: number;
  tocos: number;
  faltas: number;
}