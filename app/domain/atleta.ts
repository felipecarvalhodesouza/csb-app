import Equipe from "./equipe";

export interface Atleta {
  id: number;
  nome: string;
  numero: number;
  numeroCamisa: number;
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
  faltasDesqualificantes: number;

  atleta?: Atleta; // Para compatibilidade com a estrutura antiga, onde as estatísticas estavam aninhadas dentro de um objeto "atleta"
}