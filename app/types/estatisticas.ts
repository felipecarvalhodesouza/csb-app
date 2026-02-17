export interface EstatisticaItem {
  posicao: number
  nome: string
  equipe: string
  total: number
}

export const ESTATISTICA_TIPOS = {
  PONTOS: 'PONTOS',
  CESTA_3: 'CESTA_3',
  CESTA_2: 'CESTA_2',
  LANCE_LIVRE: 'LANCE_LIVRE',
  ASSISTENCIA: 'ASSISTENCIA',
  REBOTE: 'REBOTE',
  ROUBO: 'ROUBO',
  TOCO: 'TOCO',
} as const

export type EstatisticaTipo = typeof ESTATISTICA_TIPOS[keyof typeof ESTATISTICA_TIPOS]

export interface EstatisticaGrupo {
  tipo: EstatisticaTipo
  titulo: string
  itens: EstatisticaItem[]
}

export type EstatisticasResponse = EstatisticaGrupo[]
