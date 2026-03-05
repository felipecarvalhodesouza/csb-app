import { YStack, XStack, Text } from "tamagui"

interface Props {
  altura?: string
  peso?: string
  posicao?: string
  idade?: number
}

export function AthleteInfoCard({ altura, peso, posicao, idade }: Props) {
  const Item = ({ label, value }: any) => (
    <YStack>
      <Text fontSize={12} color="$gray9">
        {label}
      </Text>
      <Text fontSize={16} fontWeight="600" color="white">
        {value}
      </Text>
    </YStack>
  )

  return (
    <XStack
      bg="$color2"
      p="$4"
      br="$4"
      space="$5"
      jc="space-between"
    >
      <Item label="Altura" value={altura} />
      <Item label="Peso" value={peso} />
      <Item label="Posição" value={posicao} />
      <Item label="Idade" value={idade} />
    </XStack>
  )
}