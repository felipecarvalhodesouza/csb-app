import { YStack, XStack, Text } from 'tamagui'
import Jogo from '../domain/jogo'
import Parcial from '../domain/parcial'
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
        {Array.from({ length: Math.max(4, jogo.parciais.length || 1) }).map((_, idx) => {
          const score = jogo.parciais[idx] || { placarMandante: 0, placarVisitante: 0 }
          return (
            <YStack key={idx} ai="center" p="$2" bg="$gray2" br="$2">
              <Text fontSize={12}>Q{idx + 1}</Text>
              <Text fontSize={14} fontWeight="600">
                {score.placarMandante} - {score.placarVisitante}
              </Text>
            </YStack>
          )
        })}
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