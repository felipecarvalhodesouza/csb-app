import {
    YStack,
    Text,
    Image
} from 'tamagui'

type TeamScoreProps = {
    team: {
        nome: string
        imagemPath?: string
    }
    score: number
    align?: 'left' | 'right'
}

export function TeamScore({ team, score, align = 'left' }: TeamScoreProps) {

    const shortName = team.nome.substring(0, 3).toUpperCase()

    return (
        <YStack ai="center" space="$1">
        <Image
            source={
            team.imagemPath
                ? { uri: team.imagemPath }
                : require('../../assets/team.png')
            }
            width={40}
            height={40}
            resizeMode="contain"
        />

        <Text fontSize={20} fontWeight="700">
            {score | 0}
        </Text>

        <Text fontSize={12} color="$gray10">
            {shortName}
        </Text>
        </YStack>
    )
}