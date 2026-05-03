import { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { YStack, Text, Spinner, XStack } from 'tamagui'
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
          p="$2"
          mb="$3"
        >

          {/* HEADER */}
          <XStack
            ai="center"
            pb="$1"
            mb="$2"
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            <Text width={24} />

            <XStack flexGrow={1} flexShrink={1} flexBasis={0}>
              <Text fontSize={12} color="$gray9" fontWeight="700">
                Nome
              </Text>
            </XStack>

            <Text width={60} textAlign="right" fontSize={12} color="$gray9" fontWeight="700">
              Total
            </Text>

            <Text width={60} textAlign="right" fontSize={12} color="$gray9" fontWeight="700">
              Média
            </Text>
          </XStack>

          {/* LISTA */}
          {dados.map((item, index) => (
            <XStack
              key={`${item.posicao}-${item.nome}`}
              ai="center"
              py="$2"
              borderBottomWidth={index !== dados.length - 1 ? 1 : 0}
              borderColor="$borderColor"
            >

              {/* POSIÇÃO */}
              <Text width={35} fontWeight="700" color="$gray10">
                {item.posicao}.
              </Text>

              {/* NOME */}
              <YStack flexGrow={1} flexShrink={1} flexBasis={0}>
                <Text fontWeight="600" numberOfLines={1} ellipsizeMode="tail">
                  {item.nome}
                </Text>

                <Text fontSize={12} color="$gray9" numberOfLines={1} ellipsizeMode="tail">
                  {item.equipe}
                </Text>
              </YStack>

              {/* TOTAL */}
              <Text
                width={60}
                textAlign="right"
                fontWeight="800"
                fontSize={16}
              >
                {item.valor ?? 0}
              </Text>

              {/* MÉDIA */}
              <Text
                width={60}
                textAlign="right"
                fontWeight="800"
                fontSize={16}
              >
                {item.media != null ? item.media.toFixed(1) : ''}
              </Text>

            </XStack>
          ))}

        </YStack>
      )}
    </Tela>
  )
}