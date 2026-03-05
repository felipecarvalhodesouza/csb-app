import { YStack, XStack, Text } from "tamagui"

interface Estatistica {
  label: string
  valor: number
}

export function AthleteStatsTable({ stats }: { stats: Estatistica[] }) {
  return (
    <YStack space="$2">
      {stats.map((s) => (
        <XStack
          key={s.label}
          bg="$color2"
          p="$3"
          br="$3"
          jc="space-between"
        >
          <Text color="$gray10">{s.label}</Text>
          <Text fontWeight="700" color="white">
            {s.valor}
          </Text>
        </XStack>
      ))}
    </YStack>
  )
}