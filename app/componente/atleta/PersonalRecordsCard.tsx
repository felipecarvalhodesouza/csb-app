import { YStack, XStack, Text } from "tamagui"

interface PersonalRecord {
  label: string
  value: number | string
  jogo?: string
  data?: string
}

interface PersonalRecordsProps {
  records: PersonalRecord[]
}

export function PersonalRecordsCard({ records }: PersonalRecordsProps) {
  return (
    <YStack bg="$color2" br="$4" p="$4" space="$3">
      
      <Text fontSize={18} fontWeight="700" color="white">
        Recordes pessoais
      </Text>

      {records.map((record) => (
        <XStack
          key={record.label}
          ai="center"
          jc="space-between"
          verticalAlign={"center"}
          mb="$3"
        >
          <YStack>
            <XStack space="$2" ai="center">
            <Text fontSize={20} fontWeight="700" color="$blue10">
                {record.value}
            </Text>
            <Text color="$gray10" fontSize={13}>
              {record.label}
            </Text>
            </XStack>

            {record.jogo && (
              <Text color="$gray9" fontSize={11}>
                {record.jogo} {record.data ? `• ${record.data}` : ""}
              </Text>
            )}
          </YStack>


        </XStack>
      ))}
    </YStack>
  )
}