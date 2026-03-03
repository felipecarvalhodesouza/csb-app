import { YStack, XStack, Text } from 'tamagui'

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
  name: { flexBasis: 0, flexGrow: 2, flexShrink: 1 },
  stat: { flexBasis: 0, flexGrow: 1, flexShrink: 1 }
}

export default function PlayerStats({ atletas, titulares }: { atletas: EstatisticaAtleta[], titulares: boolean }) {

    return (
        <>
            <XStack bg="$gray5" p="$2">
                <Text {...COL.name} fontWeight="600">
                    {titulares ? 'Titulares' : 'Reservas'}
                </Text>

                <Text {...COL.stat} textAlign="center" fontWeight="600">PTS</Text>
                <Text {...COL.stat} textAlign="center" fontWeight="600">REB</Text>
                <Text {...COL.stat} textAlign="center" fontWeight="600">AST</Text>
                <Text {...COL.stat} textAlign="center" fontWeight="600">F</Text>
            </XStack>

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
                </XStack>
            ))}
        </>
    )
}
