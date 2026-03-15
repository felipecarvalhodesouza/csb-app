import { useState } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import { User, MoreVertical } from '@tamagui/lucide-icons'
import Modal from '../Modal'
import { EstatisticaTipo, getEstatisticaPorAthlete } from '../../domain/estatistica'

type Props = {
  nome: string
  equipeId: number
  jogoEncerrado: boolean
  registrarEvento: (tipo: EstatisticaTipo | "LL" | "2PTS" | "3PTS", equipeId: number) => void
  eventos: Array<any>
  periodoAtual: number
}

export default function CoachCard({
  nome,
  equipeId,
  jogoEncerrado,
  registrarEvento,
  eventos,
  periodoAtual
}: Props) {

  const [openModal, setOpenModal] = useState(false)
  const [confirmTempoModal, setConfirmTempoModal] = useState(false)

  // Cálculo dos tempos disponíveis
  function getTempoLimite(periodo: number) {
    if (periodo <= 2) return 2; // Primeiro tempo
    if (periodo <= 4) return 3; // Segundo tempo
    return 1; // Overtime
  }

  // Determinar o limite de tempos para o período atual
  const tempoLimite = getTempoLimite(periodoAtual);


  function getTempoPorPeriodo(periodoEvento: number, periodoAtual: number) {
    if( periodoAtual <= 2 && periodoEvento <= 2) return true;
    
    if((periodoAtual == 3 || periodoAtual == 4) && (periodoEvento == 3 || periodoEvento == 4)) return true;

    return (periodoAtual - 4 == periodoEvento - 4) && periodoAtual > 4;
  }

  // Filtrar eventos de tempo para a equipe
  const temposUsados = eventos && eventos.filter(e => e.stat === 'tempo' && e.equipe.id === equipeId && getTempoPorPeriodo(e.periodo, periodoAtual)).length;
  const temposDisponiveis = tempoLimite - temposUsados;
  const temposArray = Array.from({ length: tempoLimite }, (_, idx) => idx < temposUsados);
  return (
    <>
      <YStack
        bg="$color1"
        p="$3"
        px="$4" py="$2"

      >
        <XStack jc="space-between" ai="center">

          <XStack ai="center" space="$2">
            <User size={18} />
            <Text fontWeight="700">{nome}</Text>
          </XStack>

        <XStack ai="center" space="$2">
          {/* Visualização dos tempos */}
          <XStack gap={4}>
            {temposArray.map((usado, idx) => (
              <YStack
                key={idx}
                width={12}
                height={32}
                borderRadius={3}
                borderWidth={1}
                borderColor="$gray12"
                bg={usado ? "$red9" : "$black"}
              />
            ))}
          </XStack>
          <Button
            onPress={() => setConfirmTempoModal(true)}
            bg="$orange4"
            disabled={temposDisponiveis <= 0 || jogoEncerrado}
          >
            Tempo
          </Button>
        </XStack>

          <Button
            icon={MoreVertical}
            chromeless
            disabled={jogoEncerrado}
            onPress={() => setOpenModal(true)}
          />

        </XStack>
      </YStack>

      <Modal open={openModal}>
        <Text fontWeight="700" fontSize={18} textAlign="center">
          Registrar Falta Técnica
        </Text>
        <Button
          onPress={() => {
            registrarEvento('C1', equipeId)
            setOpenModal(false)
          }}
          bg="$yellow4"
        >
          [C1] Falta do Técnico
        </Button>
        <Button
          onPress={() => {
            registrarEvento('B1', equipeId)
            setOpenModal(false)
          }}
          bg="$orange4"
        >
          [B1] Falta do Banco
        </Button>
        <Button
          chromeless
          onPress={() => setOpenModal(false)}
        >
          Cancelar
        </Button>
      </Modal>

      {/* Modal de confirmação de tempo */}
      <Modal open={confirmTempoModal}>
        <YStack ai="center" gap={8}>
          <Text fontWeight="700" fontSize={18} textAlign="center">
            Deseja registrar a solicitação de tempo técnico?
          </Text>
          <Text fontSize={16} textAlign="center">
            Tempos disponíveis: {temposDisponiveis} de {tempoLimite}
          </Text>
          <XStack gap={4} mt={8} mb={8}>
            {temposArray.map((usado, idx) => (
              <YStack
                key={idx}
                width={12}
                height={32}
                borderRadius={3}
                borderWidth={1}
                borderColor="$gray12"
                bg={usado ? "$red9" : "$black"}
              />
            ))}
          </XStack>
          <Button
            bg="$orange4"
            onPress={() => {
              registrarEvento('TEMPO', equipeId)
              setConfirmTempoModal(false)
            }}
            disabled={temposDisponiveis <= 0 || jogoEncerrado}
          >
            Confirmar Tempo
          </Button>
          <Button chromeless onPress={() =>
                setConfirmTempoModal(false)}>
            Cancelar
          </Button>
        </YStack>
      </Modal>
    </>
  )
}