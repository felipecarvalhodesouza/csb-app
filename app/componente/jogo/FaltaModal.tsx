import {XStack, Text, Button, ScrollView } from 'tamagui'
import Modal from '../Modal'

type FaltaTipo =
  | 'pessoal'
  | 'pessoal1'
  | 'pessoal2'
  | 'pessoal3'
  | 'antidesportiva1'
  | 'antidesportiva2'
  | 'antidesportiva3'
  | 'tecnica'
  | 'desqualificante'

type Props = {
  visible: boolean
  onSelect: (tipo: FaltaTipo) => void
  onClose: () => void
}

export default function FaltaModal({ visible, onSelect, onClose }: Props) {
  if (!visible) return null

  return (
    <Modal open={visible}>

        <Text fontWeight="700" fontSize={18} ta="center">
          Tipo de falta
        </Text>

        <ScrollView maxHeight={420}>

          {/* PESSOAL */}
          <Text fontWeight="600" opacity={0.7} mb="$2">
            Pessoal
          </Text>

          <XStack flexWrap="wrap" gap="$2">
            <Button flex={1} onPress={() => onSelect('pessoal')}>
              [P] Pessoal
            </Button>

            <Button flex={1} onPress={() => onSelect('pessoal1')}>
              [P1] +1 LL
            </Button>

            <Button flex={1} onPress={() => onSelect('pessoal2')}>
              [P2] +2 LL
            </Button>

            <Button flex={1} onPress={() => onSelect('pessoal3')}>
              [P3] +3 Lances Livres
            </Button>
          </XStack>

          {/* ANTIDESPORTIVA */}
          <Text fontWeight="600" opacity={0.7} mt="$4" mb="$2">
            Antidesportiva
          </Text>

          <XStack flexWrap="wrap" gap="$2">
            <Button flex={1} onPress={() => onSelect('antidesportiva1')}>
              [U1] +1 LL
            </Button>

            <Button flex={1} onPress={() => onSelect('antidesportiva2')}>
              [U2] +2 LL
            </Button>

            <Button flex={1} onPress={() => onSelect('antidesportiva3')}>
              [U3] +3 Lances Livres
            </Button>
          </XStack>

          {/* OUTRAS */}
          <Text fontWeight="600" opacity={0.7} mt="$4" mb="$2">
            Outras
          </Text>

          <XStack flexWrap="wrap" gap="$2">
            <Button flex={1} onPress={() => onSelect('tecnica')}>
              [T] Técnica
            </Button>

            <Button flex={1} onPress={() => onSelect('desqualificante')}>
              [D] Desqualificante
            </Button>
          </XStack>

        </ScrollView>

        <Button mt="$3" variant="outlined" onPress={onClose}>
          Cancelar
        </Button>
    </Modal>
  )
}