import {
  YStack,
  Text,
  ScrollView,
  Theme,
} from 'tamagui'
import { useEffect, useState } from 'react'
import { apiFetch } from './utils/api'
import { API_BASE_URL } from '../utils/config'
import StatsSection from './componente/StatsSection'
import Header from './header'
import Footer from './footer'
import { useLocalSearchParams } from 'expo-router'

import type { EstatisticasResponse, EstatisticaGrupo } from './types/estatisticas'

export default function EstatisticasScreen() {
  const { torneioId, categoriaId, nomeCategoria, nomeTorneio } =
    useLocalSearchParams<{
      torneioId: string
      categoriaId: string
      nomeCategoria: string
      nomeTorneio: string
    }>()

  const [data, setData] = useState<EstatisticasResponse | null>(null)

  useEffect(() => {
    apiFetch<EstatisticasResponse>(
      `${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/estatisticas`
    ).then(setData)
  }, [torneioId, categoriaId])

  if (!data) return <Text>Carregando...</Text>

  // Mapeamento opcional de unidade por tipo
  const unidadePorTipo: Record<string, string> = {
    PONTOS: 'pts',
    CESTA_3: '3PT',
    CESTA_2: '2PT',
    LANCE_LIVRE: 'LL',
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" pt="$6" pb="$9" jc="space-between">
      <Header title={nomeTorneio} subtitle={nomeCategoria} />

      <ScrollView>
        <YStack p="$4" gap="$4">
          {data.map((grupo: EstatisticaGrupo) => (
            <StatsSection
              key={grupo.tipo}
              titulo={grupo.titulo}
              dados={grupo.itens}
              unidade={unidadePorTipo[grupo.tipo] || ''}
            />
          ))}
        </YStack>
      </ScrollView>

      <Footer />
      </YStack>
    </Theme>
  )
}