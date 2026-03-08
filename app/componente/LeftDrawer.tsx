import { YStack, Text, ListItem, Separator, XStack } from 'tamagui'
import { Pressable, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { Mail } from '@tamagui/lucide-icons'

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

        {/*
          <ListItem title="Torcidômetro" onPress={onClose} />
        <ListItem title="Hall da Fama" onPress={onClose} />
        <ListItem title="Jogadores" onPress={onClose} />
        <ListItem title="Transmissões" onPress={onClose} />
        */}


        <Separator />

        <Text fontSize={20} fontWeight="700">
          Contatos
        </Text>

      <YStack space="$3">
        <XStack alignItems="center" gap="$2">
        <FaWhatsapp size={24} color="green" />
          <Text fontSize={12}>13 98862-9148</Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
        <FaInstagram size={24} color="purple" />
          <Text fontSize={12}>@csb.basquete</Text>
        </XStack>

        <XStack alignItems="center" gap="$2">
          <Mail size={24} color="white" />
          <Text fontSize={12}>campeonatosantista@gmail.com</Text>
        </XStack>
      </YStack>

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
