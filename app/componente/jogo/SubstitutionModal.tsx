import { Text, Button } from 'tamagui'
import Modal from '../Modal'
import { Atleta } from '../../domain/atleta'

type Props = {
  open: boolean
  athleteToSubstitute: Atleta | null
  mandante: Atleta[]
  visitante: Atleta[]
  jogoEncerrado: boolean
  onClose: () => void
  onSubstitute: (reserva: Atleta) => void
}

export default function SubstitutionModal({
  open,
  athleteToSubstitute,
  mandante,
  visitante,
  jogoEncerrado,
  onClose,
  onSubstitute
}: Props) {

  if (!open || !athleteToSubstitute) return null

  const reservas = (athleteToSubstitute.teamId === 'mandante' ? mandante : visitante).filter(a => !a.emQuadra && !a.expulso)

  return (
    <Modal open={open} width={320}>
      <Text fontWeight="700" fontSize={18} mb="$2" ta="center">
        Substituir <Text fontWeight="700">{athleteToSubstitute.nome}</Text>
      </Text>

      {reservas.map(reserva => (
        <Button
          key={reserva.id}
          mb="$2"
          onPress={() => onSubstitute(reserva)}
          disabled={jogoEncerrado}
        >
          {reserva.nome} <Text color="$gray10">#{reserva.numero}</Text>
        </Button>
      ))}

      <Button mt="$4" onPress={onClose}>
        Fechar
      </Button>
    </Modal>
  )
}