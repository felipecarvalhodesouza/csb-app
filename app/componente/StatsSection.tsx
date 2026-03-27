
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
      p="$4"
      mb="$3"
    >
      <XStack jc="space-between" ai="center" mb="$2">
        <Text fontSize={16} fontWeight="700">
          {titulo}
        </Text>
        {onVerTodos && dados.length == 5 && (
          <XStack ai="center" gap="$1" onPress={onVerTodos}>
            <Text fontSize={12} color="$gray12" fontWeight="600">
              Ver mais
            </Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="$gray12" />
          </XStack>
        )}
      </XStack>

      {dados.length === 0 && (
        <Text color="$gray9" fontStyle="italic">
          Sem dados disponíveis
        </Text>
      )}

      {dados.length > 0 && dados.map((item, index) => (
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
            {item.valor ?? 0}
          </Text>
        </XStack>
      ))}

    </YStack>
  )
}
