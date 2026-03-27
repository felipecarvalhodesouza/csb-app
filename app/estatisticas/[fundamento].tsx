import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, ScrollView, Spinner, XStack } from 'tamagui'
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
          <YStack
            bg="$backgroundStrong"
            borderRadius={12}
            p="$4"
            mb="$3"
          >
            {dados.map((item, index) => (
              <XStack
                key={`${item.posicao}-${item.nome}`}
                jc="space-between"
                ai="center"
                py="$2"
                borderBottomWidth={index !== dados.length - 1 ? 1 : 0}
                borderColor="$borderColor"
              >
                <XStack ai="center" gap="$2" flex={1}>
                  <Text fontWeight="700" color="$gray10">
                    {item.posicao}.
                  </Text>
                  <YStack flex={1}>
                    <Text fontWeight="600" ellipsizeMode="tail" numberOfLines={1}>{item.nome}</Text>
                    <Text fontSize={12} color="$gray9" ellipsizeMode="tail" numberOfLines={1}>
                      {item.equipe}
                    </Text>
                  </YStack>
                </XStack>

                <Text fontWeight="800" fontSize={16}>
                  {item.valor}
                </Text>
              </XStack>
            ))}
          </YStack>
      )}
    </Tela>
  )
}
