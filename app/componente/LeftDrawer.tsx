import { YStack, Text, ListItem } from 'tamagui'
import { Pressable, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'

type Props = {
  open: boolean
  onClose: () => void
}

export default function LeftDrawer({ open, onClose }: Props) {
  const router = useRouter()
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
      zIndex={100}
      flexDirection="row"
    >
      {/* Drawer */}
      <YStack
        width={drawerWidth}
        height="100%"
        bg="$background"
        p="$5"
        pt="$10"
        gap="$4"
        animation="quick"
        enterStyle={{ x: -drawerWidth }}
      >
        <Text fontSize={20} fontWeight="700">
          Menu
        </Text>

        <ListItem
          title="Modalidades"
          onPress={() => {
            onClose()
            router.push('/modalidades')
          }}
        />

        <ListItem title="Torcidômetro" onPress={onClose} />
        <ListItem title="Hall da Fama" onPress={onClose} />
        <ListItem title="Jogadores" onPress={onClose} />
        <ListItem title="Transmissões" onPress={onClose} />
      </YStack>

      {/* Overlay clicável */}
      <Pressable
        onPress={onClose}
        style={{
          width: screenWidth - drawerWidth,
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      />
    </YStack>
  )
}
