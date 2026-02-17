
import {
  YStack,
  XStack,
  Text
} from 'tamagui'

type EstatisticaItem = {
  atletaId: number
  nome: string
  equipe: string
  valor: number
}

type Props = {
  titulo: string
  dados: EstatisticaItem[]
  unidade?: string
}

export default function StatsSection({ titulo, dados}: Props) {
  return (
    <YStack
      bg="$backgroundStrong"
      borderRadius={12}
      p="$4"
      mb="$3"
    >
      <Text fontSize={16} fontWeight="700" mb="$2">
        {titulo}
      </Text>

      {dados.length === 0 && (
        <Text color="$gray9" fontStyle="italic">
          Sem dados disponíveis
        </Text>
      )}

      {dados.length > 0 && dados.map((item, index) => (
        <XStack
          key={item.atletaId}
          jc="space-between"
          ai="center"
          py="$2"
          borderBottomWidth={index !== dados.length - 1 ? 1 : 0}
          borderColor="$borderColor"
        >
          <XStack ai="center" gap="$2">
            <Text fontWeight="700" color="$gray10">
              {index + 1}.
            </Text>
            <YStack>
              <Text fontWeight="600">{item.nome}</Text>
              <Text fontSize={12} color="$gray9">
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
  )
}
