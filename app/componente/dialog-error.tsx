import { Dialog, YStack, Text, Button } from 'tamagui'

type DialogErrorProps = {
  open: boolean
  onClose: () => void
  message: string | null
}

export default function DialogError({ open, onClose, message }: DialogErrorProps) {
  if (!message) return null

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose()
    }}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          elevate
          bordered
          p="$4"
          backgroundColor="white"
          w={300}
          animation={[
            'quick',
            { opacity: { overshootClamping: true }, transform: { overshootClamping: true } },
          ]}
        >
          <Dialog.Title>
            <Text fontWeight="700" fontSize="$4" textAlign="center" color="$red10">
              Erro
            </Text>
          </Dialog.Title>

          <YStack ai="center" gap="$2">
            <Text textAlign="center" fontSize="$2" color="gray">
              {message}
            </Text>
            <Button
              mt="$2"
              onPress={onClose}
              backgroundColor="black"
              color="white"
            >
              Fechar
            </Button>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
