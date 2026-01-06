import { YStack, Text, Button, Image } from 'tamagui'

type DialogProps = {
  open: boolean
  onClose: () => void
  message: string | null
  type?: 'error' | 'success'
  title?: string
}

export default function Dialog({ open, onClose, message, type = 'error', title }: DialogProps) {
  if (!message || !open) return null

  const isSuccess = type === 'success'
  const defaultTitle = isSuccess ? 'Sucesso' : 'Erro'
  const titleColor = isSuccess ? '$green10' : '$red10'

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bg="rgba(0,0,0,0.8)"
      zIndex={200}
      jc="center"
      ai="center"
    >
      <YStack
        width={280}
        bg="white"
        p="$5"
        br="$8"
        elevation="$6"
        zIndex={201}
        gap="$4"
        ai="center"
      >
        {isSuccess && (
          <Image
            source={require('../../assets/success.png')}
            width={50}
            height={50}
            resizeMode="contain"
          />
        )}
        <Text fontWeight="700" fontSize="$4" textAlign="center" color={titleColor}>
          {title || defaultTitle}
        </Text>
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
    </YStack>
  )
}
