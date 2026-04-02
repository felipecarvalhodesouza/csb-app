import { YStack, XStack, Text, ScrollView } from 'tamagui'

type EstatisticaAtleta = {
  id: string;
  nome: string;
  pontos: number;
  rebotes: number;
  assistencias: number;
  faltas: number;
  roubos: number;
  tocos: number;
};

const COL = {
  name: { width: 160 }, // fixa (nome maior)
  stat: { width: 60 }   // largura fixa evita quebrar layout
}

export default function PlayerStats({
  atletas,
  titulares
}: {
  atletas: EstatisticaAtleta[],
  titulares: boolean
}) {

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {/* minWidth garante ocupar 100% e expandir se precisar */}
      <YStack minWidth="100%">

        {/* HEADER */}
        <XStack bg="$gray5" p="$2">
          <Text {...COL.name} fontWeight="600">
            {titulares ? 'Titulares' : 'Reservas'}
          </Text>

          <Text {...COL.stat} textAlign="center" fontWeight="600">PTS</Text>
          <Text {...COL.stat} textAlign="center" fontWeight="600">REB</Text>
          <Text {...COL.stat} textAlign="center" fontWeight="600">AST</Text>
          <Text {...COL.stat} textAlign="center" fontWeight="600">F</Text>
          <Text {...COL.stat} textAlign="center" fontWeight="600">STL</Text>
          <Text {...COL.stat} textAlign="center" fontWeight="600">BLK</Text>
        </XStack>

        {/* LINHAS */}
        {atletas.map((jogador, i) => (
          <XStack
            key={jogador.id}
            p="$2"
            bg={i % 2 === 0 ? '$background' : '$gray2'}
          >
            <Text
              {...COL.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {jogador.nome}
            </Text>

            <Text {...COL.stat} textAlign="center">
              {jogador.pontos}
            </Text>
            <Text {...COL.stat} textAlign="center">
              {jogador.rebotes}
            </Text>
            <Text {...COL.stat} textAlign="center">
              {jogador.assistencias}
            </Text>
            <Text {...COL.stat} textAlign="center">
              {jogador.faltas}
            </Text>
            <Text {...COL.stat} textAlign="center">
              {jogador.roubos ?? 0}
            </Text>
            <Text {...COL.stat} textAlign="center">
              {jogador.tocos ?? 0}
            </Text>
          </XStack>
        ))}

      </YStack>
    </ScrollView>
  )
}