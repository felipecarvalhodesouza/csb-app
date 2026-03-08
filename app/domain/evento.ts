import Equipe from "./equipe"
import { EstatisticaTipo } from "./estatistica"

export default interface Evento {
  id?: number
  tipo: EstatisticaTipo | 'LL' | '2PTS' | '3PTS',
  responsavelId: number
  jogoId: number
  timestamp: string
  equipe: Equipe,
  periodo: number,
  descricao: string
  equipeId: number
}
