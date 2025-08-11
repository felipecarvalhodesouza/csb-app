import { useState } from 'react'
import {
  YStack,
  XStack,
  Text,
  Image,
  Avatar,
  ListItem,
  Separator,
  Button
} from 'tamagui'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'

type HeaderSectionProps = {
  title: string
  subtitle?: string
  button?: React.ReactNode
}

export default function Header({ title, subtitle, button }: HeaderSectionProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setOpen(false)
    router.replace('/login')
  }

  return (
    <>
      <YStack px="$4" pt="$1" pb="$3" bg="$background">
        <XStack jc="space-between" ai="center">
        {!button && (
          <Image
            source={require('../assets/logo.png')}
            width={50}
            height={50}
          />
        )}
        {button && (<>{button}</>)}  

          <YStack f={1} ai="center" jc="center">
            <Text fontSize={16} fontWeight="600" ta="center">
              {title}
            </Text>
            {subtitle && (
              <Text fontSize={!button ? 12 : 24} color="$gray10" ta="center">
                {subtitle}
              </Text>
            )}
          </YStack>

          <Avatar circular size="$3" onPress={() => setOpen(true)}>
            <Avatar.Image
              source={require('../assets/avatar-placeholder.png')}
            />
          </Avatar>
        </XStack>
      </YStack>

      {open && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.6)"
          zIndex={100}
          jc="center"
          ai="center"
          // Dica: se quiser efeito de blur, pode usar 'backdropFilter' via CSS ou tamagui custom prop
        >
          {/* Clique fora para fechar */}
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />

          {/* Modal principal */}
          <YStack
            width={320}
            bg="$backgroundStrong"
            p="$5"
            br="$8"
            elevation="$5"
            zIndex={101}
            animation="quick"
            enterStyle={{ opacity: 0, scale: 0.9 }}
            exitStyle={{ opacity: 0, scale: 0.9 }}
            opacity={1}
            scale={1}
            gap="$3"
            shadowColor="black"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={10}
          >
            <Text fontSize={20} fontWeight="700" ta="center" mb="$2">
              Menu
            </Text>

            <ListItem
              title="Perfil"
              onPress={() => {
                setOpen(false)
                router.push('/perfil')
              }}
            />
            <ListItem
              title="Configurações"
              onPress={() => {
                setOpen(false)
                router.push('/configuracoes')
              }}
            />

            <Separator my="$3" />

            <Button
              size="$4"
              theme="red"
              onPress={handleLogout}
            >
              Sair
            </Button>

            <Button
              size="$3"
              variant="outlined"
              onPress={() => setOpen(false)}
            >
              <Text>Fechar</Text>
            </Button>
          </YStack>
        </YStack>
      )}
    </>
  )
}
