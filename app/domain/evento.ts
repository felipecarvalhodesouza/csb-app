export default interface Evento {
  id?: number
  tipo: 'LL' | '2PTS' | '3PTS' | 'ASSIST' | 'REBOTE' | 'ROUBO' | 'TOCO' | 'FALTA' | 'SUBSTITUICAO_IN' | 'SUBSTITUICAO_OUT' | 'ERRO' | 'FT' | 'FAD' | 'FIM_QUARTO'
  responsavelId: number
  jogoId: number
  timestamp: string
  equipeId: number
}
