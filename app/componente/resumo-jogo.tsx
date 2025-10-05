import { YStack, XStack, Text } from 'tamagui'
import Jogo from '../domain/jogo'
import format from '../utils/date-formatter'
import { formatHour } from '../utils/date-formatter'


export default function ResumoJogo({ jogo }: { jogo: Jogo }) {
  return (
    <YStack space="$4" ai="center" width="100%">

      { <YStack ai="center">
        <Text fontSize={16} fontWeight="600" mb="$2">
          Local e Data
        </Text>
        <Text color="$gray10">{jogo.local?.nome || 'Local não definido'}</Text>
        <Text color="$gray10">{format(jogo.data) || 'Data não definida'}</Text>
        <Text color="$gray10">{formatHour(jogo.data) || ''}</Text>
      </YStack>}

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
        <Text color="$gray10">Árbitro Principal: {jogo.arbitroPrincipal?.nome || 'Não definido'}</Text>
        <Text color="$gray10">Árbitro Auxiliar: {jogo.arbitroAuxiliar?.nome || 'Não definido'}</Text>
        <Text color="$gray10">Mesário: {jogo.mesario?.nome || 'Não definido'}</Text>
        <Text color="$gray10">Estatístico: {jogo.estatistico?.nome || 'Não definido'}</Text>
      </YStack>
    </YStack>
  )
}