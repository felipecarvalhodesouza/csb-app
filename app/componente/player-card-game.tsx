import React from 'react'
import { ScrollView, Card, YStack, XStack, Text, Button, Separator } from 'tamagui'
import { Plus, Repeat } from '@tamagui/lucide-icons'

type AthleteStats = {
  id: number
  nome: string
  numero: string
  equipeId: number
  teamId: 'mandante' | 'visitante'
  pontos: number
  rebotes: number
  assistencias: number
  roubos: number
  tocos: number
  faltas: number
  titular: boolean
  emQuadra: boolean
}

type AthleteCardsProps = {
  athletes: AthleteStats[]
  addPoints: (id: number, pts: number, equipeId: number) => void
  updateAthleteStats: (id: number, stat: keyof AthleteStats, value: number) => void
  handleSubstituicao: (athlete: AthleteStats) => void
}

export default function AthleteCards({
  athletes,
  addPoints,
  updateAthleteStats,
  handleSubstituicao,
}: AthleteCardsProps) {
  return (
    <ScrollView px="$4" py="$2">
      {athletes
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .filter(a => a.emQuadra === true)
        .map(a => (
          <Card
            key={a.id}
            mb="$3"
            borderColor={a.faltas >= 5 ? "$red8" : "$gray6"}
            borderWidth={1}
            borderRadius={8}
          >
            <YStack p="$3">
                <XStack ai="center" jc="space-between">
                    <Text fontWeight="700" fontSize={16}>
                      {a.nome} 
                    </Text>
                    <Text color="$gray10">#{a.numero}</Text>
                </XStack>
                <Separator my="$2" />
              <XStack ai="center" jc="space-between">
                <Button
                  icon={Repeat}
                  chromeless
                  onPress={() => handleSubstituicao(a)}
                  mr="$2"
                  aria-label="Substituir atleta"
                />
                <XStack jc="center" gap={4} mt="$2" mb="$2">
                  {[...Array(5)].map((_, idx) => (
                    <YStack
                      key={idx}
                      width={12}
                      height={12}
                      borderRadius={6}
                      borderWidth={1}
                      borderColor="$gray12"
                      bg={idx < a.faltas ? "$red8" : "transparent"}
                    />
                  ))}
                </XStack>
                <Text fontWeight="700" fontSize={18}>{a.pontos} pts</Text>
              </XStack>
              <XStack mt="$2" jc="space-between">
                <Button onPress={() => addPoints(a.id, 1, Number(a.equipeId))} icon={Plus}>1 PT</Button>
                <Button onPress={() => addPoints(a.id, 2, Number(a.equipeId))} icon={Plus}>2 PTS</Button>
                <Button onPress={() => addPoints(a.id, 3, Number(a.equipeId))} icon={Plus}>3 PTS</Button>
              </XStack>
              <XStack jc="space-between" mt="$2" flexWrap="wrap">
                <Button width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'rebotes', 1)}>
                  <Text>REB: {a.rebotes}</Text>
                </Button>
                <Button width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'assistencias', 1)}>
                  <Text>AST: {a.assistencias}</Text>
                </Button>
                <Button width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'roubos', 1)}>
                  <Text>STL: {a.roubos}</Text>
                </Button>
                <Button width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'tocos', 1)}>
                  <Text>BLK: {a.tocos}</Text>
                </Button>
                <Button width={20} maxWidth={100} flex={1} onPress={() => updateAthleteStats(a.id, 'faltas', 1)}>
                  <Text>FL: {a.faltas}</Text>
                </Button>
              </XStack>
            </YStack>
          </Card>
        ))}
    </ScrollView>
  )
}