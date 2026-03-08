import React , { useState, useEffect } from 'react'
import { ScrollView, Card, YStack, XStack, Text, Button, Separator } from 'tamagui'
import { Plus, Repeat } from '@tamagui/lucide-icons'
import { Atleta } from '../../domain/atleta'
import FaltaModal from './FaltaModal' 


type AthleteCardsProps = {
  athletes: Atleta[]
  addPoints: (id: number, pts: number, equipeId: number) => void
  updateAthleteStats: (id: number, stat: keyof Atleta | string, value: number) => void
  handleSubstituicao: (athlete: Atleta) => void
  jogoEncerrado: boolean
}

export default function AthleteCards({
  athletes,
  addPoints,
  updateAthleteStats,
  handleSubstituicao,
  jogoEncerrado
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

  const handleFalta = (tipo: 'pessoal' | 'pessoal1' | 'pessoal2' | 'pessoal3' | 'tecnica' | 'desqualificante' |
                             'antidesportiva1' | 'antidesportiva2' | 'antidesportiva3') => {
    if (modalFalta.atletaId == null) return
    if (tipo === 'pessoal') updateAthleteStats(modalFalta.atletaId, 'faltas', 1)
    if (tipo === 'pessoal1') updateAthleteStats(modalFalta.atletaId, 'faltas1', 1)
    if (tipo === 'pessoal2') updateAthleteStats(modalFalta.atletaId, 'faltas2', 1)
    if (tipo === 'pessoal3') updateAthleteStats(modalFalta.atletaId, 'faltas3', 1)
    if (tipo === 'tecnica') updateAthleteStats(modalFalta.atletaId, 'ft', 1)
    if (tipo === 'desqualificante') updateAthleteStats(modalFalta.atletaId, 'fd', 1)
    if (tipo === 'antidesportiva1') updateAthleteStats(modalFalta.atletaId, 'fad1', 1)
    if (tipo === 'antidesportiva2') updateAthleteStats(modalFalta.atletaId, 'fad2', 1)
    if (tipo === 'antidesportiva3') updateAthleteStats(modalFalta.atletaId, 'fad3', 1)
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
                  disabled={jogoEncerrado}
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
                <Button disabled={a.expulso || jogoEncerrado} onPress={() => addPoints(a.id, 1, Number(a.equipeId))} icon={Plus}>1 PT</Button>
                <Button disabled={a.expulso || jogoEncerrado} onPress={() => addPoints(a.id, 2, Number(a.equipeId))} icon={Plus}>2 PTS</Button>
                <Button disabled={a.expulso || jogoEncerrado} onPress={() => addPoints(a.id, 3, Number(a.equipeId))} icon={Plus}>3 PTS</Button>
              </XStack>
              <XStack jc="space-between" mt="$2" flexWrap="wrap">
                <Button disabled={a.expulso || jogoEncerrado} width={18} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'rebotes', 1)}>
                  <Text fontSize={12} textAlign='center'>REB: {a.rebotes}</Text>
                </Button>
                <Button disabled={a.expulso || jogoEncerrado} width={18} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'assistencias', 1)}>
                  <Text fontSize={12} textAlign='center'>AST: {a.assistencias}</Text>
                </Button>
                <Button disabled={a.expulso || jogoEncerrado} width={18} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'roubos', 1)}>
                  <Text fontSize={12} textAlign='center'>STL: {a.roubos}</Text>
                </Button>
                <Button disabled={a.expulso || jogoEncerrado} width={18} maxWidth={100} flex={1} mr="$2" onPress={() => updateAthleteStats(a.id, 'tocos', 1)}>
                  <Text fontSize={12} textAlign='center'>BLK: {a.tocos}</Text>
                </Button>
                <Button
                    width={18}
                    maxWidth={100}
                    flex={1}
                    onPress={() => handleOpenFaltaModal(a.id)}
                    disabled={a.expulso || jogoEncerrado}
                  >
                  <Text fontSize={12} textAlign='center'>FL: {a.faltas}</Text>
                </Button>
              </XStack>
            </YStack>
          </Card>
        ))}
    </ScrollView>

      <FaltaModal
        visible={modalFalta.atletaId !== null}
        onSelect={handleFalta}
        onClose={handleCloseFaltaModal}
      />
    </>
  )
}