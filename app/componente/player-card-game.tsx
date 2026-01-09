import React , { useState, useEffect } from 'react'
import { ScrollView, Card, YStack, XStack, Text, Button, Separator } from 'tamagui'
import { Plus, Repeat } from '@tamagui/lucide-icons'
import { Atleta } from '../domain/atleta'


type AthleteCardsProps = {
  athletes: Atleta[]
  addPoints: (id: number, pts: number, equipeId: number) => void
  updateAthleteStats: (id: number, stat: keyof Atleta | string, value: number) => void
  handleSubstituicao: (athlete: Atleta) => void
}

export default function AthleteCards({
  athletes,
  addPoints,
  updateAthleteStats,
  handleSubstituicao,
}: AthleteCardsProps) {
  

  const [modalFalta, setModalFalta] = useState<{ atletaId: number | null }>(
    { atletaId: null }
  )

    useEffect(() => {
    const expulso = athletes.find(a => a.expulso && a.emQuadra)
      if (expulso) {

        const reservas = athletes.filter(a => !a.emQuadra && !a.expulso)
        if (reservas.length > 0) {
          handleSubstituicao(expulso)
        }
      }
  }, [athletes, handleSubstituicao])


  const handleOpenFaltaModal = (id: number) => {
    setModalFalta({ atletaId: id })
  }

  const handleCloseFaltaModal = () => {
    setModalFalta({ atletaId: null })
  }

  const handleFalta = (tipo: 'normal' | 'tecnica' | 'antidesportiva') => {
    if (modalFalta.atletaId == null) return
    if (tipo === 'normal') updateAthleteStats(modalFalta.atletaId, 'faltas', 1)
    if (tipo === 'tecnica') updateAthleteStats(modalFalta.atletaId, 'ft', 1)
    if (tipo === 'antidesportiva') updateAthleteStats(modalFalta.atletaId, 'fad', 1)
    handleCloseFaltaModal()
  }

  return (
  <>
    <ScrollView px="$4" py="$2">
      {athletes
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .filter(a => a.emQuadra === true)
        .map(a => (
          <Card
            key={a.id}
            mb="$3"
            borderColor={a.expulso ? "$red8" : "$gray6"}
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
                <Button disabled={a.expulso} onPress={() => addPoints(a.id, 1, Number(a.equipeId))} icon={Plus}>1 PT</Button>
                <Button disabled={a.expulso} onPress={() => addPoints(a.id, 2, Number(a.equipeId))} icon={Plus}>2 PTS</Button>
                <Button disabled={a.expulso} onPress={() => addPoints(a.id, 3, Number(a.equipeId))} icon={Plus}>3 PTS</Button>
              </XStack>
              <XStack jc="space-between" mt="$2" flexWrap="wrap">
                <Button disabled={a.expulso} width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'rebotes', 1)}>
                  <Text fontSize={12} textAlign='center'>REB: {a.rebotes}</Text>
                </Button>
                <Button disabled={a.expulso} width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'assistencias', 1)}>
                  <Text fontSize={12} textAlign='center'>AST: {a.assistencias}</Text>
                </Button>
                <Button disabled={a.expulso} width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'roubos', 1)}>
                  <Text fontSize={12} textAlign='center'>STL: {a.roubos}</Text>
                </Button>
                <Button disabled={a.expulso} width={20} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'tocos', 1)}>
                  <Text fontSize={12} textAlign='center'>BLK: {a.tocos}</Text>
                </Button>
                <Button
                    width={20}
                    maxWidth={100}
                    flex={1}
                    onPress={() => handleOpenFaltaModal(a.id)}
                    disabled={a.expulso}
                  >
                  <Text fontSize={12} textAlign='center'>FL: {a.faltas}</Text>
                </Button>
              </XStack>
            </YStack>
          </Card>
        ))}
    </ScrollView>

      {/* Modal de faltas */}
      {modalFalta.atletaId !== null && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0,0,0,0.6)"
          zIndex={200}
          jc="center"
          ai="center"
        >
          <YStack
            bg="$background"
            p="$4"
            borderRadius={12}
            width={260}
            elevation={4}
            zIndex={201}
            ai="center"
            gap="$3"
          >
            <Text fontWeight="700" fontSize={18} mb="$2" ta="center">
              Tipo de falta
            </Text>
            <Button width="100%" onPress={() => handleFalta('normal')}>Normal</Button>
            <Button width="100%" onPress={() => handleFalta('tecnica')}>Técnica</Button>
            <Button width="100%" onPress={() => handleFalta('antidesportiva')}>Antidesportiva</Button>
            <Button mt="$3" variant="outlined" onPress={handleCloseFaltaModal}>Cancelar</Button>
          </YStack>
        </YStack>
      )}
    </>
  )
}