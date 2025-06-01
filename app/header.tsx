import { YStack, Text } from 'tamagui'

type HeaderSectionProps = {
  title: string
}

export default function Header({ title }: HeaderSectionProps) {
  return (
    <YStack p="$4" pt="$6">
      <Text fontSize={20} fontWeight="600" ta="center">
        {title}
      </Text>
    </YStack>
  )
}
