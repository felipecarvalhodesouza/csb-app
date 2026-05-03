import {
  YStack,
  XStack,
  Text
} from 'tamagui'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { EstatisticaItem } from '../types/estatisticas'

type Props = {
  titulo: string
  tipo: string
  dados: EstatisticaItem[]
  unidade?: string
  onVerTodos?: () => void
}

export default function StatsSection({ titulo, dados, onVerTodos }: Props) {
  return (
    <YStack
      bg="$backgroundStrong"
      borderRadius={12}
      p="$2"
      mb="$3"
    >
      {/* HEADER DA SEÇÃO */}
      <XStack jc="space-between" ai="center" mb="$2">
        <Text fontSize={16} fontWeight="700">
          {titulo}
        </Text>

        {onVerTodos && dados.length === 5 && (
          <XStack ai="center" gap="$1" onPress={onVerTodos} mr={-20}>
            <Text fontSize={12} color="$gray12" fontWeight="600">
              Ver mais
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="$gray12" />
          </XStack>
        )}
      </XStack>

      {/* HEADER DAS COLUNAS */}
      {dados.length > 0 && (
        <XStack
          ai="center"
          pb="$1"
          mb="$1"
          borderBottomWidth={1}
          borderColor="$borderColor"
        >
          {/* POSIÇÃO */}
          <Text width={24} />

          {/* NOME */}
          <XStack flexGrow={1} flexShrink={1} flexBasis={0}>
            <Text fontSize={12} color="$gray9" fontWeight="700">
              Nome
            </Text>
          </XStack>

          {/* TOTAL */}
          <Text width={60} textAlign="right" fontSize={12} color="$gray9" fontWeight="700">
            Total
          </Text>

          {/* MÉDIA */}
          <Text width={60} textAlign="right" fontSize={12} color="$gray9" fontWeight="700">
            Média
          </Text>
        </XStack>
      )}

      {/* SEM DADOS */}
      {dados.length === 0 && (
        <Text color="$gray9" fontStyle="italic">
          Sem dados disponíveis
        </Text>
      )}

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
          <Text width={24} fontWeight="700" color="$gray10">
            {item.posicao}.
          </Text>

          <YStack
            flexGrow={1}
            flexShrink={1}
            flexBasis={0}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" fontWeight="600">
              {item.nome}
            </Text>

            <Text numberOfLines={1} ellipsizeMode="tail" fontSize={12} color="$gray9">
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
  )
}