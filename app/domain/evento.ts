import Equipe from "./equipe"

export default interface Evento {
  id?: number
  tipo: 'LL' | '2PTS' | '3PTS' | 'ASSIST' | 'REBOTE' | 'ROUBO' | 'TOCO' | 'FALTA' | 'SUBSTITUICAO_IN' | 
        'SUBSTITUICAO_OUT' | 'ERRO' | 'FALTA_TECNICA' | 'FALTA_ANTIDESPORTIVA' | 'FIM_QUARTO'
  responsavelId: number
  jogoId: number
  timestamp: string
  equipe: Equipe,
  periodo: number,
  descricao: string
  equipeId: number
}
