import React, { useEffect, useState } from 'react'
import { YStack, XStack, Text, Button, Theme, Sheet, ScrollView, Card, Tabs } from 'tamagui'
import { ChevronLeft, Undo } from '@tamagui/lucide-icons'
import Header from './header'
import Footer from './footer'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { apiFetch, apiPost } from './utils/api'
import Jogo from './domain/jogo'
import AthleteCards from './componente/player-card-game'
import Evento from './domain/evento'
import { getEstatisticaPorAthlete } from './domain/estatistica'
import { Atleta } from './domain/atleta'
import { API_BASE_URL } from '../utils/config'

export default function EstatisticasAoVivoScreen() {
  const { jogoId } = useLocalSearchParams()
  const router = useRouter()
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [mandante, setMandante] = useState<Atleta[]>([])
  const [visitante, setVisitante] = useState<Atleta[]>([])
  const [activeTeam, setActiveTeam] = useState<'mandante' | 'visitante'>('mandante')
  const [quarto, setQuarto] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modalSubstituicao, setModalSubstituicao] = useState(false)
  const [athleteToSubstitute, setAthleteToSubstitute] = useState<Atleta | null>(null)
  const [actionHistory, setActionHistory] = useState<any[]>([])

  useEffect(() => {
    async function fetchJogo() {
      setLoading(true)
      try {
        const jogoData = await apiFetch<any>(`${API_BASE_URL}/jogos/${jogoId}`)
        setJogo(jogoData)
        setMandante(
          (jogoData.atletasMandante || []).map(a => ({
            id: a.atleta.id,
            nome: a.atleta.nome ?? 'Sem nome',
            numero: a.atleta.numero ?? '',
            equipeId: a.atleta.equipe.id,
            teamId: 'mandante',
            pontos: a.pontos | 0,
            rebotes: a.rebotes | 0,
            assistencias: a.assistencias | 0,
            roubos: a.roubos | 0,
            tocos: a.tocos | 0,
            faltas: a.faltas | 0,
            titular: a.titular === true as boolean,
            emQuadra: a.emQuadra === true as boolean,
            expulso: a.expulso === true as boolean,
          }))
        )
        setVisitante(
          (jogoData.atletasVisitante || []).map(a => ({
            id: a.atleta.id,
            nome: a.atleta.nome ?? 'Sem nome',
            numero: a.atleta.numero ?? '',
            equipeId: a.atleta.equipe.id,
            teamId: 'visitante',
            pontos: a.pontos | 0,
            rebotes: a.rebotes | 0,
            assistencias: a.assistencias | 0,
            roubos: a.roubos | 0,
            tocos: a.tocos | 0,
            faltas: a.faltas | 0,
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

  function handleFaults(atleta: Atleta, faltasDesqualificante: boolean){
    if(faltasDesqualificante) {
      atleta.faltasDesqualificantes = (atleta.faltasDesqualificantes || 0) + 1;
    }

    if(atleta.faltas >= 5 || atleta.faltasDesqualificantes >= 2){
      atleta.expulso = true;
    }
  }

  async function updateAthleteStats(athleteId: number, stat: keyof Atleta | string, value: number) {

    const faltasDesqualificante = (stat == 'ft' || stat == 'fad');
    const statAuxiliar =  faltasDesqualificante ? 'faltas' : stat;

    (activeTeam === 'mandante' ? setMandante : setVisitante)(athletes =>
      athletes.map(a => {
        if (a.id === athleteId) {
          const updatedAthlete = { 
            ...a, [statAuxiliar]: Math.max(0, Number(a[statAuxiliar]) + value)
          }
          handleFaults(updatedAthlete, faltasDesqualificante)
          return updatedAthlete
        }
        return a
      })
    )

    if(stat !== 'pontos') {
      await handleEvent({
        tipo: getEstatisticaPorAthlete(stat),
        responsavelId: athleteId,
        jogoId: jogo.id,
        timestamp: new Date(Date.now()).toISOString().slice(0, 19),
        equipeId: activeTeam === 'mandante' ? jogo.mandante.id : jogo.visitante.id,
        periodo: quarto
      })
    }

    setActionHistory(h => [...h, { athleteId, stat, value }])
  }

  async function addPoints(athleteId: number, points: number, equipeId: number) {
    await handleEvent({
      tipo: points == 1 ? 'LL' : points == 2 ? '2PTS' : '3PTS',
      responsavelId: athleteId,
      jogoId: jogo.id,
      timestamp: new Date(Date.now()).toISOString().slice(0, 19),
      equipeId: equipeId,
      periodo: quarto
    })
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

  function handleSubstituicao(athlete: Atleta) {
    setAthleteToSubstitute(athlete)
    setModalSubstituicao(true)
  }

    async function handleEvent(event: Evento) {
      try {
        await apiPost(`${API_BASE_URL}/jogos/${jogo.id}/eventos`, event)
      } catch (e) {
        alert('Erro ao enviar evento')
      }
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
                .filter(a => !a.emQuadra && !a.expulso)
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
