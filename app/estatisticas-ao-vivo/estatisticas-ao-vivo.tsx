import React, { useEffect, useState } from 'react'
import { YStack, XStack, Text, Button, Theme, Tabs } from 'tamagui'
import { Flag, Undo, ChevronLeft, FileArchive } from '@tamagui/lucide-icons'
import Header from '../header'
import Footer from '../footer'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { apiFetch, apiPost, apiDelete } from '../utils/api'
import Jogo from '../domain/jogo'
import AthleteCards from '../componente/jogo/AthleteCard'
import Evento from '../domain/evento'
import { EstatisticaTipo, getEstatisticaPorAthlete } from '../domain/estatistica'
import { Atleta } from '../domain/atleta'
import { API_BASE_URL } from '../../utils/config'
import { getBrazilLocalDateTimeString } from '../utils/date-formatter'
import { Platform } from 'react-native'
import Dialog from '../componente/dialog-error'
import CoachCard from '../componente/jogo/CoachCard'
import { Tela } from '../componente/layout/tela'
import Modal from '../componente/Modal'
import SubstitutionModal from '../componente/jogo/SubstitutionModal'
import GameHeader from '../componente/jogo/GameHeader'
import AdminModal from '../componente/jogo/AdminModal'
import TeamTabs from '../componente/jogo/TeamTabs'

export default function EstatisticasAoVivoScreen() {
  const { jogoId } = useLocalSearchParams()
  const router = useRouter()
  const [jogo, setJogo] = useState<Jogo | null>(null)
  const [mandante, setMandante] = useState<Atleta[]>([])
  const [visitante, setVisitante] = useState<Atleta[]>([])
  const [activeTeam, setActiveTeam] = useState<'mandante' | 'visitante'>('mandante')
  const [quarto, setQuarto] = useState(1)
  const [jogoEncerrado, setJogoEncerrado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modalSubstituicao, setModalSubstituicao] = useState(false)
  const [modalAdministracao, setModalAdministracao] = useState(false)
  const [athleteToSubstitute, setAthleteToSubstitute] = useState<Atleta | null>(null)
  const [actionHistory, setActionHistory] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<boolean | null>(null)

  useEffect(() => {
    async function fetchJogo() {
      setLoading(true)
      try {
        const jogoData = await apiFetch<any>(`${API_BASE_URL}/jogos/${jogoId}`)
        setJogo(jogoData)
        setActionHistory(jogoData.eventos.map((evento: any) => ({
          athleteId: evento.responsavel?.id,
          stat: evento.stat,
          value: evento.pontos ? evento.pontos : 1
        })))
        setQuarto(jogoData.periodo || 1)
        setMandante(
          (jogoData.atletasMandante || []).map(a => ({
            id: a.id,
            nome: a.atleta.nome ?? 'Sem nome',
            numero: a.numeroCamisaJogo ?? '',
            equipeId: jogoData.mandante.id,
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
            id: a.id,
            nome: a.atleta.nome ?? 'Sem nome',
            numero: a.numeroCamisaJogo ?? '',
            equipeId: jogoData.visitante.id,
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
        if(jogoData.status === 'ENCERRADO') {
          setJogoEncerrado(true)
        }
      } catch (e: any) {
        console.log(e)
        setError(true)
        setMessage(e.message || 'Erro ao criar o atleta.')
        setShowDialog(true)
      } finally {
        setLoading(false)
      }
    }
    fetchJogo()
  }, [jogoId])

  const placarMandante = mandante.reduce((sum, a) => sum + a.pontos, 0)
  const placarVisitante = visitante.reduce((sum, a) => sum + a.pontos, 0)

  function handleFaults(atleta: Atleta, faltaDesqualificante: boolean, faltaTecnicaOuAntidesportiva: boolean) {
    if(faltaTecnicaOuAntidesportiva) {
      atleta.faltasDesqualificantes = (atleta.faltasDesqualificantes || 0) + 1;
    }

    if(atleta.faltas >= 5 || atleta.faltasDesqualificantes >= 2 || faltaDesqualificante) {
      atleta.expulso = true;
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setMessage(null)
    setError(null)
  }

  async function updateAthleteStats(athleteId: number, stat: keyof Atleta | string, value: number) {

    const faltaDesqualificante = stat === 'fd';
    const faltaTecnicaOuAntidesportiva = (stat == 'ft'  || stat == 'fad1' || stat == 'fad2' || stat == 'fad3');
    const falta = faltaDesqualificante || faltaTecnicaOuAntidesportiva || stat === 'faltas1' || stat === 'faltas2' || stat === 'faltas3';
    const statAuxiliar =  falta ? 'faltas' : stat;

    (activeTeam === 'mandante' ? setMandante : setVisitante)(athletes =>
      athletes.map(a => {
        if (a.id === athleteId) {
          const updatedAthlete = { 
            ...a, [statAuxiliar]: Math.max(0, Number(a[statAuxiliar]) + value)
          }
          handleFaults(updatedAthlete, faltaDesqualificante, faltaTecnicaOuAntidesportiva)
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
        timestamp: getBrazilLocalDateTimeString(),
        equipeId: activeTeam === 'mandante' ? jogo.mandante.id : jogo.visitante.id,
        periodo: quarto,
        equipe: undefined,
        descricao: ''
      })
    }

    setActionHistory(h => [...h, { athleteId, stat, value }])
  }

  async function addPoints(athleteId: number, points: number, equipeId: number) {
    await handleEvent({
      tipo: points == 1 ? 'LL' : points == 2 ? '2PTS' : '3PTS',
      responsavelId: athleteId,
      jogoId: jogo.id,
      timestamp: getBrazilLocalDateTimeString(),
      equipeId: equipeId,
      periodo: quarto,
      equipe: undefined,
      descricao: ''
    })
    updateAthleteStats(athleteId, 'pontos', points)
  }

  async function nextQuarter() {
    if(quarto >= 4 && placarMandante !== placarVisitante) {
      return;
    }

      await handleEvent({
        tipo: 'FIM_QUARTO',
        responsavelId: undefined,
        jogoId: jogo.id,
        timestamp: getBrazilLocalDateTimeString(),
        equipeId: undefined,
        periodo: quarto,
        equipe: undefined,
        descricao: ''
      })
      setQuarto(q => q + 1)
      setModalAdministracao(false)
  }

    async function encerrarJogo() {
    if (quarto >= 4 && placarMandante !== placarVisitante){
        setJogoEncerrado(true);
        await apiPost<any>(`${API_BASE_URL}/jogos/${jogoId}/encerrar`, {})
        setModalAdministracao(false)
    }
  }

  async function undoLastAction() {
    if (actionHistory.length === 0) return

    try{
          await apiDelete<any>(`${API_BASE_URL}/jogos/${jogoId}/eventos`, {})
    } catch(e) {
        setMessage( 
        e.message || 'Erro ao desfazer a última ação',
      )
      setShowDialog(true)
      return;
    }

    const last = actionHistory[actionHistory.length - 1]
    updateAthleteStats(last.athleteId, last.stat, -last.value)
    setActionHistory(h => h.slice(0, -1))
  }

  function handleSubstituicao(athlete: Atleta) {
    setAthleteToSubstitute(athlete)
    setModalSubstituicao(true)
  }

	function handleGerarSumula() {
	  apiFetch(
	    `${API_BASE_URL}/jogos/${jogoId}/sumula`,
	    {},
	    'html'
	  )
	    .then((html) => {
	      if (Platform.OS === 'web') {
	        const newWindow = window.open('', '_blank')

	        if (newWindow) {
	          newWindow.document.open()
	          newWindow.document.write(html)
	          newWindow.document.close()
	        }
	      } else {
        
	      }

	    })
	    .catch(() => {
	      alert('Erro ao gerar súmula')
	    })
	  }

  function substituirAtleta(reserva: Atleta) {
    handleEvent({
      tipo: 'SUBSTITUICAO_OUT',
      responsavelId: athleteToSubstitute.id,
      jogoId: jogo.id,
      timestamp: getBrazilLocalDateTimeString(),
      equipeId: athleteToSubstitute.equipeId,
      periodo: quarto,
      equipe: undefined,
      descricao: ''
    })

    handleEvent({
      tipo: 'SUBSTITUICAO_IN',
      responsavelId: reserva.id,
      jogoId: jogo.id,
      timestamp: getBrazilLocalDateTimeString(),
      equipeId: athleteToSubstitute.equipeId,
      periodo: quarto,
      equipe: undefined,
      descricao: ''
    })

    const titulares = (athleteToSubstitute.teamId === 'mandante' ? mandante : visitante).map(a =>
        a.id === athleteToSubstitute.id
          ? { ...reserva, emQuadra: true }
          : a.id === reserva.id
          ? { ...athleteToSubstitute, emQuadra: false }
          : a
      )
    if (athleteToSubstitute.teamId === 'mandante') {
      setMandante(titulares)
    } else {
      setVisitante(titulares)
    }
    setModalSubstituicao(false)
    setAthleteToSubstitute(null)
  }

  function handleCoachEvent(tipo: EstatisticaTipo | "LL" | "2PTS" | "3PTS", equipeId: number){
      handleEvent({
        tipo,
        responsavelId: undefined,
        jogoId: jogo.id,
        timestamp: getBrazilLocalDateTimeString(),
        equipeId: equipeId,
        periodo: quarto,
        equipe: undefined,
        descricao: ''
      })
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
    <>
    <Tela title={jogo.mandante.nome + ' vs ' + jogo.visitante.nome}
          subtitle={`${placarMandante} - ${placarVisitante}`} 
          button={<Button icon={ChevronLeft} chromeless onPress={() => router.back()} />}
          scroll={false}>

      <GameHeader
        jogoEncerrado={jogoEncerrado}
        quarto={quarto}
        actionHistoryLength={actionHistory.length}
        onUndo={undoLastAction}
        onAdministrar={() => setModalAdministracao(true)}
        onGerarSumula={handleGerarSumula}
      />

        <TeamTabs
          activeTeam={activeTeam}
          onChange={setActiveTeam}
          mandanteName={jogo.mandante.nome}
          visitanteName={jogo.visitante.nome}
        />

        <AthleteCards
          athletes={activeTeam === 'mandante' ? mandante : visitante}
          addPoints={addPoints}
          updateAthleteStats={updateAthleteStats}
          handleSubstituicao={handleSubstituicao}
          jogoEncerrado={jogoEncerrado}
        />

        <SubstitutionModal
          open={modalSubstituicao}
          athleteToSubstitute={athleteToSubstitute}
          mandante={mandante}
          visitante={visitante}
          jogoEncerrado={jogoEncerrado}
          onClose={() => setModalSubstituicao(false)}
          onSubstitute={substituirAtleta}
        />

        <CoachCard
          nome={activeTeam === 'mandante' ? jogo.tecnicoMandante?.nome || 'Técnico' : jogo.tecnicoVisitante?.nome || 'Técnico'}
          equipeId={activeTeam === 'mandante' ? jogo.mandante.id : jogo.visitante.id}
          jogoEncerrado={jogoEncerrado}
          registrarEvento={handleCoachEvent}
        />

        <AdminModal
          open={modalAdministracao}
          onClose={() => setModalAdministracao(false)}
          jogoEncerrado={jogoEncerrado}
          quarto={quarto}
          placarMandante={placarMandante}
          placarVisitante={placarVisitante}
          onNextQuarter={nextQuarter}
          onEncerrarJogo={encerrarJogo}
        />
    </Tela>

      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        message={message}
        type={'error'}
      />
    </>
  )
}

