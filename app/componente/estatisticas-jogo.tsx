import { YStack, XStack, Text, Button } from 'tamagui'

type EstatisticasJogoProps = {
  timeSelecionado: 'CHI' | 'DAL'
  setTimeSelecionado: (time: 'CHI' | 'DAL') => void
  jogo: any
}

export default function EstatisticasJogo({ timeSelecionado, setTimeSelecionado, jogo }: EstatisticasJogoProps) {
  const eventos = jogo?.eventos?.[timeSelecionado] ?? []

  return (
    <>
      {/* Botões para alternar time */}
      <XStack jc="center" mb="$3" space>
        <Button
          size="$2"
          variant="outlined"
          backgroundColor={timeSelecionado === 'CHI' ? '$blue8' : undefined}
          color={timeSelecionado === 'CHI' ? '$color' : undefined}
          onPress={() => setTimeSelecionado('CHI')}
        >
          BOS
        </Button>
        <Button
          size="$2"
          variant="outlined"
          backgroundColor={timeSelecionado === 'DAL' ? '$blue8' : undefined}
          color={timeSelecionado === 'DAL' ? '$color' : undefined}
          onPress={() => setTimeSelecionado('DAL')}
        >
          ORL
        </Button>
      </XStack>

      {/* Tabela de estatísticas */}
      <YStack borderWidth={1} borderColor="$gray6" br="$3" >
        {/* Cabeçalho */}
        <XStack bg="$gray5" p="$2">
          <Text flex={2} fontWeight="600">Titulares</Text>
          <Text flex={1} textAlign="center" fontWeight="600">PTS</Text>
          <Text flex={1} textAlign="center" fontWeight="600">REB</Text>
          <Text flex={1} textAlign="center" fontWeight="600">AST</Text>
          <Text flex={1} textAlign="center" fontWeight="600">F</Text>
        </XStack>

        {/* Linhas Titulares */}
        {eventos.filter((j: any) => j.titular).length === 0 && (
          <XStack p="$2">
            <Text flex={1} color="$gray10" textAlign="center">Sem dados de titulares</Text>
          </XStack>
        )}
        {eventos.filter((j: any) => j.titular).map((jogador: any, i: number) => (
          <XStack key={i} p="$2" bg={i % 2 === 0 ? '$background' : '$gray2'}>
            <Text flex={2}>{jogador.nome} <Text fontSize={10} color="$gray10">{jogador.pos}</Text></Text>
            <Text flex={1} textAlign="center">{jogador.pts}</Text>
            <Text flex={1} textAlign="center">{jogador.reb}</Text>
            <Text flex={1} textAlign="center">{jogador.ast}</Text>
            <Text flex={1} textAlign="center">{jogador.fault}</Text>
          </XStack>
        ))}

        <XStack bg="$gray5" p="$2">
          <Text flex={2} fontWeight="600">Reservas</Text>
          <Text flex={1} textAlign="center" fontWeight="600">PTS</Text>
          <Text flex={1} textAlign="center" fontWeight="600">REB</Text>
          <Text flex={1} textAlign="center" fontWeight="600">AST</Text>
          <Text flex={1} textAlign="center" fontWeight="600">F</Text>
        </XStack>
        {/* Linhas Reservas */}
        {eventos.filter((j: any) => !j.titular).length === 0 && (
          <XStack p="$2">
            <Text flex={1} color="$gray10" textAlign="center">Sem dados de reservas</Text>
          </XStack>
        )}
        {eventos.filter((j: any) => !j.titular).map((jogador: any, i: number) => (
          <XStack key={i} p="$2" bg={i % 2 === 0 ? '$background' : '$gray2'}>
            <Text flex={2}>{jogador.nome} <Text fontSize={10} color="$gray10">{jogador.pos}</Text></Text>
            <Text flex={1} textAlign="center">{jogador.pts}</Text>
            <Text flex={1} textAlign="center">{jogador.reb}</Text>
            <Text flex={1} textAlign="center">{jogador.ast}</Text>
            <Text flex={1} textAlign="center">{jogador.fault}</Text>
          </XStack>
        ))}
      </YStack>
    </>
  )
}