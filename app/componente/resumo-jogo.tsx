import { YStack, XStack, Text } from 'tamagui'


export default function ResumoJogo({ jogo: Jogo }) {
  return (
    <YStack space="$4" ai="center" width="100%">

      {/* Local e Data (mockados, pois não há no mockJogo) */}
      { <YStack ai="center">
        <Text fontSize={16} fontWeight="600" mb="$2">
          Local e Data
        </Text>
        <Text color="$gray10">Ginásio Central</Text>
        <Text color="$gray10">2025/03/04 18:00</Text>
      </YStack>}

      {/* Parciais de cada quarto (mockados para exemplo) */}
      <YStack width="100%" ai="center">
        <Text fontSize={16} fontWeight="600" mb="$2">
          Parciais
        </Text>
        <XStack jc="space-between" width="80%">
          {[{CHI: 18, DAL: 12}, {CHI: 20, DAL: 16}, {CHI: 22, DAL: 18}, {CHI: 18, DAL: 19}].map((score, idx) => (
            <YStack key={idx} ai="center" p="$2" bg="$gray2" br="$2">
              <Text fontSize={12}>Q{idx + 1}</Text>
              <Text fontSize={14} fontWeight="600">
                {score.CHI} - {score.DAL}
              </Text>
            </YStack>
          ))}
        </XStack>
      </YStack>

      {/* Oficiais (mockados para exemplo) */}
      <YStack width="100%" ai="center">
        <Text fontSize={16} fontWeight="600" mb="$2">
          Oficiais
        </Text>
        <Text color="$gray10">Árbitros: João Silva, Maria Souza</Text>
        <Text color="$gray10">Mesário: Carlos Pinto</Text>
      </YStack>
    </YStack>
  )
}