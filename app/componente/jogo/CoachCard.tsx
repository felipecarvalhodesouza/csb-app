import { useState } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import { User, MoreVertical } from '@tamagui/lucide-icons'
import Modal from '../Modal'
import { EstatisticaTipo } from '../../domain/estatistica'

type Props = {
  nome: string
  equipeId: number
  jogoEncerrado: boolean
  registrarEvento: (tipo: EstatisticaTipo | "LL" | "2PTS" | "3PTS", equipeId: number) => void
}

export default function CoachCard({
  nome,
  equipeId,
  jogoEncerrado,
  registrarEvento
}: Props) {

  const [openModal, setOpenModal] = useState(false)

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
    </>
  )
}