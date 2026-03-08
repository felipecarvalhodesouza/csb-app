import { XStack, YStack, Text, Button } from "tamagui"
import { EstatisticaTipo } from "../../domain/estatistica"

type Evento = {
  id: number
  tipo: EstatisticaTipo
  camisaAtleta: string
  equipeNome: string
  periodo: string
  ordem: string
}

export function EventoAuditoriaItem({
  evento,
  onDelete,
}: {
  evento: Evento
  onDelete: (id: number) => void
}) {
  return (
    <XStack
      bg="$color2"
      p="$3"
      br="$4"
      ai="center"
      space="$3"
    >
      <Text color="white" fontSize={15}>
        {evento.ordem}
      </Text>

      <YStack f={1}>
        <Text color="white" fontSize={15}>
          {evento.tipo}
        </Text>

        <Text color="$gray10" fontSize={12}>
          {evento.camisaAtleta !== "-" && `#${evento.camisaAtleta} - `}
          {evento.equipeNome}
        </Text>
      </YStack>

      <XStack space="$2">
        <Button size="$2" bg="$red10" onPress={() => onDelete(evento.id)}>
          🗑
        </Button>
      </XStack>
    </XStack>
  )
}