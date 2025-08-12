import React, { useEffect, useState } from 'react'
import { YStack, XStack, Text, Button, Theme, Sheet, ScrollView, Card, Tabs } from 'tamagui'
import { ChevronLeft, Undo } from '@tamagui/lucide-icons'
import Header from './header'
import Footer from './footer'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { apiFetch } from './utils/api'
import Jogo from './domain/jogo'
import AthleteCards from './componente/player-card-game'

type AthleteStats = {
  id: number
  nome: string
  numero: string
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

export default function EstatisticasAoVivoScreen() {
  const { jogoId } = useLocalSearchParams()
  const router = useRouter()
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [mandante, setMandante] = useState<AthleteStats[]>([])
  const [visitante, setVisitante] = useState<AthleteStats[]>([])
  const [activeTeam, setActiveTeam] = useState<'mandante' | 'visitante'>('mandante')
  const [quarto, setQuarto] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modalSubstituicao, setModalSubstituicao] = useState(false)
  const [athleteToSubstitute, setAthleteToSubstitute] = useState<AthleteStats | null>(null)
  const [actionHistory, setActionHistory] = useState<any[]>([])

  useEffect(() => {
    async function fetchJogo() {
      setLoading(true)
      try {
        const jogoData = await apiFetch<any>(`http://192.168.1.13:8080/jogos/${jogoId}`)
        setJogo(jogoData)
        setMandante(
          (jogoData.atletasMandante || []).map(a => ({
            id: a.atleta.id,
            nome: a.atleta.nome ?? 'Sem nome',
            numero: a.atleta.numero ?? '',
            teamId: 'mandante',
            pontos: 0,
            rebotes: 0,
            assistencias: 0,
            roubos: 0,
            tocos: 0,
            faltas: 0,
            titular: a.titular === true as boolean,
            emQuadra: a.emQuadra === true as boolean,
          }))
        )
        setVisitante(
          (jogoData.atletasVisitante || []).map(a => ({
            id: a.atleta.id,
            nome: a.atleta.nome ?? 'Sem nome',
            numero: a.atleta.numero ?? '',
            teamId: 'visitante',
            pontos: 0,
            rebotes: 0,
            assistencias: 0,
            roubos: 0,
            tocos: 0,
            faltas: 0,
            titular: a.titular === true as boolean,
            emQuadra: a.emQuadra === true as boolean,
          }))
        )
      } catch (e) {
        alert('Erro ao carregar dados do jogo')
      } finally {
        setLoading(false)
      }
    }
    fetchJogo()
  }, [jogoId])

  const placarMandante = mandante.reduce((sum, a) => sum + a.pontos, 0)
  const placarVisitante = visitante.reduce((sum, a) => sum + a.pontos, 0)

  function updateAthleteStats(athleteId: number, stat: keyof AthleteStats, value: number) {
    
    (activeTeam === 'mandante' ? setMandante : setVisitante)(athletes =>
      athletes.map(a =>
        a.id === athleteId
          ? { ...a, [stat]: Math.max(0, Number(a[stat]) + value) }
          : a
      )
    )
    setActionHistory(h => [...h, { athleteId, stat, value }])
  }

  function addPoints(athleteId: number, points: number) {
    updateAthleteStats(athleteId, 'pontos', points)
  }

  function nextQuarter() {
    if (quarto < 4) {
      setQuarto(q => q + 1)
    }
  }

  function undoLastAction() {
    if (actionHistory.length === 0) return
    const last = actionHistory[actionHistory.length - 1]
    updateAthleteStats(last.athleteId, last.stat, -last.value)
    setActionHistory(h => h.slice(0, -1))
  }

  function handleSubstituicao(athlete: AthleteStats) {
    setAthleteToSubstitute(athlete)
    setModalSubstituicao(true)
  }

  if (loading || !jogo) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text>Carregando...</Text>
      </YStack>
    )
  }

  return (
    <Theme>
      <YStack f={1} bg="$background" jc="space-between" pb="$9" pt="$6">
        <Header
          title={jogo.mandante.nome + ' vs ' + jogo.visitante.nome}
          subtitle={`${placarMandante} - ${placarVisitante}`}
          button={<Button icon={ChevronLeft} chromeless onPress={() => router.back()} />}
        />
        
        <XStack jc="space-between" ai="center" px="$4" py="$2" bg="$backgroundStrong" borderRadius={8} mb="$2">
          <YStack>
            <Text fontSize={14} color="$gray10">Período</Text>
            <Text fontWeight="700" fontSize={18} textAlign="center">{quarto}</Text>
          </YStack>
          <Button icon={Undo} chromeless onPress={undoLastAction} disabled={actionHistory.length === 0}>Desfazer</Button>
          <Button onPress={nextQuarter} chromeless>Próximo Período</Button>
        </XStack>

        {/* Team Tabs */}
        <Tabs value={activeTeam} onValueChange={v => setActiveTeam(v as 'mandante' | 'visitante') } ml={"$4"} mr={"$4"}>
            
        <Tabs.List width="100%" justifyContent="space-between" alignItems="center" mb="$2">
            <Tabs.Tab value="mandante" flex={1}>
              <Text>{String(jogo.mandante.nome)}</Text>
            </Tabs.Tab>
            <Tabs.Tab value="visitante" flex={1}>
              <Text>{String(jogo.visitante.nome)}</Text>
            </Tabs.Tab>
        </Tabs.List>
        </Tabs>

        {/* Players Cards */}
        <ScrollView px="$4" py="$2">
          { activeTeam === 'mandante' && (
            <AthleteCards
              athletes={mandante}
              addPoints={addPoints}
              updateAthleteStats={updateAthleteStats}
              handleSubstituicao={handleSubstituicao}
            />
          )}
          { activeTeam === 'visitante' && (
            <AthleteCards
              athletes={visitante}
              addPoints={addPoints}
              updateAthleteStats={updateAthleteStats}
              handleSubstituicao={handleSubstituicao}
            />
          )}
        </ScrollView>

        {modalSubstituicao && athleteToSubstitute && (
            <YStack
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              bg="rgba(0,0,0,0.8)"
              zIndex={100}
              jc="center"
            >
            <YStack p="$4" zIndex={101}>
              <Text fontWeight="700" fontSize={18} mb="$2" ta='center'>
                Substituir <Text fontWeight="700">{athleteToSubstitute.nome}</Text>
              </Text>
              {(athleteToSubstitute.teamId == 'mandante' ? mandante : visitante)
                .filter(a => !a.titular)
                .map(reserva => (
                  <Button
                    key={reserva.id}
                    mb="$2"
                    onPress={() => {
                      const titulares = (athleteToSubstitute.teamId === 'mandante' ? mandante : visitante).map(a =>
                        a.id === athleteToSubstitute.id
                          ? { ...reserva, emQuadra: true }
                          : a.id === reserva.id
                          ? { ...athleteToSubstitute, emQuadra: false }
                          : a
                      )
                      if (activeTeam === 'mandante') {
                        setMandante(titulares)
                      } else {
                        setVisitante(titulares)
                      }
                      setModalSubstituicao(false)
                      setAthleteToSubstitute(null)
                    }}
                  >
                    {reserva.nome} <Text color="$gray10">#{reserva.numero}</Text>
                  </Button>
                ))}
              <Button mt="$4" onPress={() => setModalSubstituicao(false)}>
                Fechar
              </Button>
            </YStack>
          </YStack>
        )}

        <Footer />
      </YStack>
    </Theme>
  )
}