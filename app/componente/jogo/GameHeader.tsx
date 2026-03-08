import { XStack, YStack, Text, Button } from 'tamagui'
import { Undo, Flag, FileArchive } from '@tamagui/lucide-icons'

type Props = {
  jogoEncerrado: boolean
  quarto: number
  actionHistoryLength: number
  onUndo: () => void
  onAdministrar: () => void
  onGerarSumula: () => void
}

export default function GameHeader({
  jogoEncerrado,
  quarto,
  actionHistoryLength,
  onUndo,
  onAdministrar,
  onGerarSumula
}: Props) {

  if (jogoEncerrado) {
    return (
      <XStack
        jc="center"
        ai="center"
        px="$4"
        py="$2"
        bg="$backgroundStrong"
        borderRadius={8}
        mb="$2"
      >
        <YStack
          px="$4"
          py="$2"
          bg="$red2"
          borderRadius={20}
          mb="$2"
          ai="center"
          jc="center"
          alignSelf="center"
          elevation={3}
          borderWidth={2}
          borderColor="$red6"
          maxWidth={200}
        >
          <Text
            fontWeight="700"
            fontSize={16}
            color="$red10"
            letterSpacing={1}
            textAlign="center"
          >
            🏁 Jogo Encerrado
          </Text>
        </YStack>

        <Button
          m="$1"
          icon={FileArchive}
          onPress={onGerarSumula}
          disabled={!jogoEncerrado}
          chromeless
        >
          Gerar Súmula
        </Button>
      </XStack>
    )
  }

  return (
    <XStack
      jc="space-between"
      ai="center"
      px="$4"
      py="$2"
      bg="$backgroundStrong"
      borderRadius={8}
      mb="$2"
    >
      <YStack>
        <Text fontSize={14} color="$gray10">Período</Text>
        <Text fontWeight="700" fontSize={18} textAlign="center">
          {quarto > 4 ? 'OT ' + (quarto - 4) : quarto}
        </Text>
      </YStack>

      <Button
        icon={Undo}
        chromeless
        onPress={onUndo}
        disabled={actionHistoryLength === 0}
      >
        Desfazer
      </Button>

      <Button
        icon={Flag}
        onPress={onAdministrar}
        disabled={jogoEncerrado}
      >
        Administrar
      </Button>
    </XStack>
  )
}