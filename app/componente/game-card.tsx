import { YStack, XStack, Text, Image, useWindowDimensions } from 'tamagui'
import Jogo from '../domain/jogo'
import format, { formatHour } from '../utils/date-formatter'

export default function GameCard({ jogo, onPress }: GameCardProps) {
  const { width } = useWindowDimensions()
  const isLive = jogo.transmissao?.toLowerCase() === 'live'
  const hasScore = true ||
    jogo.pontuacaoMandante !== undefined &&
    jogo.pontuacaoVisitante !== undefined

  return (
    <YStack
      bg="$background"
      br="$4"
      p="$4"
      m="$2"
      space="$3"
      onPress={onPress}
      width={width - 32}
      maxWidth="100%"
    >
      <XStack jc="space-between" ai="center">
        {/* Mandante */}
        <YStack ai="center" w={80} jc="center" space="$1">
          <Image
            source={
              jogo.mandante.imagemPath
                ? { uri: jogo.mandante.imagemPath }
                : require('../../assets/team.png')
            }
            width={40}
            height={40}
            resizeMode="contain"
          />
          {hasScore && (
            <Text fontSize={24} fontWeight="800" color="$color">
              {jogo.pontuacaoMandante || '-'}
            </Text>
          )}
          <Text
            fontSize={12}
            ta="center"
            numberOfLines={2}
            style={{ minHeight: 32 }}
          >
            {jogo.mandante.nome}
          </Text>
        </YStack>

        {/* Centro - Informações */}
        <YStack flex={1} ai="center" space="$2">
          <Text fontSize={12} color="$gray10" ta="center">
            📍 {jogo.local || 'Local não definido'}
          </Text>
          <Text
            fontSize={16}
            fontWeight="700"
            color={isLive ? 'red' : '$color'}
          >
            {isLive
              ? 'AO VIVO'
              : jogo.data
              ? format(jogo.data)
              : 'Data não definida'}
          </Text>
          <Text
            fontSize={16}
            fontWeight="700"
            color={'$color'}
          >
            { jogo.data
              ? formatHour(jogo.data)
              : 'Horário não definido'}
          </Text>
        </YStack>

        {/* Visitante */}
        <YStack ai="center" w={80} jc="center" space="$1">
          <Image
            source={
              jogo.visitante.imagemPath
                ? { uri: jogo.visitante.imagemPath }
                : require('../../assets/team.png')
            }
            width={40}
            height={40}
            resizeMode="contain"
          />
          {hasScore && (
            <Text fontSize={24} fontWeight="800" color="$color">
              {jogo.pontuacaoVisitante || '-'}
            </Text>
          )}
          <Text
            fontSize={12}
            ta="center"
            numberOfLines={2}
            style={{ minHeight: 32 }}
          >
            {jogo.visitante.nome}
          </Text>
        </YStack>
      </XStack>

      {/* Transmissão abaixo */}
      {jogo.transmissao && (
        <Text fontSize={11} color="$gray9" ta="center" mt="$2">
          {jogo.transmissao}
        </Text>
      )}
    </YStack>
  )
}

type GameCardProps = {
  jogo: Jogo
  onPress: () => void
}
