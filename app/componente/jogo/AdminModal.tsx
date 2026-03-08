import { Button } from 'tamagui'
import Modal from '../Modal'

type Props = {
  open: boolean
  onClose: () => void
  jogoEncerrado: boolean
  quarto: number
  placarMandante: number
  placarVisitante: number
  onNextQuarter: () => void
  onEncerrarJogo: () => void
  onAuditoriaEventos: () => void
}

export default function AdminModal({
  open,
  onClose,
  jogoEncerrado,
  quarto,
  placarMandante,
  placarVisitante,
  onNextQuarter,
  onEncerrarJogo,
  onAuditoriaEventos
}: Props) {

  if (!open) return null

  return (
    <Modal open={open} >
      <Button
        m="$1"
        onPress={onNextQuarter}
        disabled={jogoEncerrado}
        chromeless
      >
        {quarto >= 4 ? 'Prorrogação' : 'Próximo Período'}
      </Button>

      <Button
        m="$1"
        onPress={onEncerrarJogo}
        disabled={quarto < 4 || jogoEncerrado || placarMandante === placarVisitante}
      >
        Encerrar Partida
      </Button>

      <Button m="$1" disabled={jogoEncerrado}>
        Editar Parciais
      </Button>

      <Button m="$1" disabled={jogoEncerrado} onPress={onAuditoriaEventos}>
        Auditoria de Eventos
      </Button>

      <Button mt="$1" onPress={onClose}>
        Fechar
      </Button>
    </Modal>
  )
}