import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, ScrollView, Spinner } from 'tamagui'
import { apiFetch } from '../utils/api'
import { API_BASE_URL } from '../../utils/config'
import { Tela } from '../componente/layout/tela'
import type { EstatisticaItem } from '../types/estatisticas'

type Params = {
  torneioId: string
  categoriaId: string
  fundamento: string
  titulo: string
}

export default function EstatisticaFundamentoScreen() {
  const { torneioId, categoriaId, fundamento, titulo } = useLocalSearchParams<Params>()
  const [dados, setDados] = useState<EstatisticaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!torneioId || !categoriaId || !fundamento) return

    setLoading(true)
    setError(null)

    apiFetch<EstatisticaItem[] | { itens: EstatisticaItem[] }>(
      `${API_BASE_URL}/torneios/${torneioId}/categorias/${categoriaId}/estatisticas/${fundamento}`
    )
      .then(response => {
        if (Array.isArray(response)) {
          setDados(response)
        } else if (response && Array.isArray((response as any).itens)) {
          setDados((response as any).itens)
        } else {
          setDados([])
          setError('Resposta inválida de estatísticas.')
        }
      })
      .catch(err => {
        console.error(err)
        setError('Erro ao carregar estatísticas completas.')
      })
      .finally(() => setLoading(false))
  }, [torneioId, categoriaId, fundamento])

  return (
    <Tela title={`Estatísticas: ${titulo}`}>
      {loading ? (
        <YStack f={1} jc="center" ai="center">
          <Spinner size="large" />
        </YStack>
      ) : error ? (
        <YStack f={1} jc="center" ai="center">
          <Text color="$red10">{error}</Text>
        </YStack>
      ) : dados.length === 0 ? (
        <Text f={1} color="$gray10" textAlign="center">
          Nenhum dado encontrado para {titulo}.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          <YStack space="$2">
            {dados.map((item, index) => (
              <YStack key={`${item.posicao}-${item.nome}`} p="$3" bg="$backgroundStrong" br="$8">
                <Text fontWeight="700">{item.posicao}. {item.nome}</Text>
                <Text fontSize={12} color="$gray9">{item.equipe}</Text>
                <Text fontWeight="800" fontSize={18}>{item.total}</Text>
              </YStack>
            ))}
          </YStack>
        </ScrollView>
      )}
    </Tela>
  )
}
