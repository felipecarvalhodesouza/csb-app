import { YStack, Text, Button, ListItem } from 'tamagui'
import { Pressable, Dimensions } from 'react-native'

type Props = {
  open: boolean
  onClose: () => void
  onLogout: () => void
}

export default function RightDrawer({ open, onClose, onLogout }: Props) {
  const screenWidth = Dimensions.get('window').width
  const drawerWidth = screenWidth * 0.8

  if (!open) return null

  return (
    <YStack
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={150}
      flexDirection="row"
    >
      {/* Overlay */}
      <Pressable
        onPress={onClose}
        style={{
          width: screenWidth - drawerWidth,
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Drawer */}
      <YStack
        width={drawerWidth}
        height="100%"
        bg="$background"
        p="$5"
        gap="$4"
        pt="$10"
        animation="quick"
        enterStyle={{ x: drawerWidth }}
      >
        <Text fontSize={18} fontWeight="700">
          Minha Conta
        </Text>

        <ListItem title="Configurações" onPress={onClose} />

        <Button theme="red" onPress={onLogout}>
          Sair
        </Button>
      </YStack>
    </YStack>
  )
}
