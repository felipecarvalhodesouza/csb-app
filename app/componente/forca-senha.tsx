import { YStack } from 'tamagui'

export default function PasswordStrengthBar({ strength }: { strength: 'Fraca' | 'Média' | 'Forte' | null }) {

  const getBlockColor = (index: number) => {
    if (!strength) return '$gray6'

    if (strength === 'Fraca') return index === 0 ? '$red10' : '$gray6'
    if (strength === 'Média') return index < 2 ? '$yellow10' : '$gray6'
    if (strength === 'Forte') return '$green10'

    return '$gray6'
  }

  return (
    <YStack alignSelf="stretch" mt="$2" flexDirection="row" gap="$1" >
      {[0, 1, 2].map((index) => (
        <YStack
          key={index}
          flex={1}
          height={6}
          br={999}
          bg={getBlockColor(index)}
        />
      ))}
    </YStack>
  )
}
