import { useState, useEffect } from 'react'
import {
  YStack,
  XStack,
  Text,
  Image,
  Button,
  ListItem,
  Separator
} from 'tamagui'
import { useRouter } from 'expo-router'
import { Pressable } from 'react-native'
import { LogOut, Star } from '@tamagui/lucide-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiFetch } from './utils/api'
import Equipe from './domain/equipe'
import { API_BASE_URL } from '../utils/config'

type HeaderSectionProps = {
  title: string
  subtitle?: string
  button?: React.ReactNode
  equipe?: any
}

export default function Header({ title, subtitle, button, equipe }: HeaderSectionProps) {
  const [open, setOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [favorito, setFavorito] = useState(false)
  const router = useRouter()


  useEffect(() => {
    async function checkFavorito() {
      if (!equipe) return
      const fav = await AsyncStorage.getItem('equipe_favorita')
      setFavorito(fav ? JSON.parse(fav).id == equipe : false)
    }
    checkFavorito()
  }, [equipe])

  const handleToggleFavorito = async () => {
    if (!equipe) return
    if (favorito) {
      await AsyncStorage.removeItem('equipe_favorita')
      setFavorito(false)
    } else {
      const equipeResponse = await apiFetch<Equipe>(`${API_BASE_URL}/equipes/${equipe}`)
      await AsyncStorage.setItem('equipe_favorita', JSON.stringify(equipeResponse))
      setFavorito(true)
    }
  }

  const handleLogout = async () => {
    setConfirmLogout(false)
    setOpen(false)
    router.replace('/login')
  }

  return (
    <>
      <YStack px="$4" pt="$1" pb="$3" bg="$background">
        <XStack jc="space-between" ai="center">
          {!button && !equipe && (
            <Image
              source={require('../assets/logo.png')}
              width={50}
              height={50}
            />
          )}
          {button && !equipe && (<>{button}</>)}

          {!button && equipe && (
            <Button
              chromeless
              onPress={handleToggleFavorito}
              aria-label="Favorito"
            >
              <Star
                color={favorito ? 'yellow' : 'black'}
                fill={favorito ? 'yellow' : 'transparent'}
                stroke={favorito ? 'yellow' : 'white'}
                size={24}
              />
            </Button>
          )}

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
          <Button
            icon={LogOut}
            chromeless
            onPress={() => setConfirmLogout(true)}
            aria-label="Logout"
          />
        </XStack>
      </YStack>

      {/* Modal de menu */}
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
        >
          <Pressable
            onPress={() => setOpen(false)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          />

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
              onPress={() => setConfirmLogout(true)}
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

      {/* Modal de confirmação de logout */}
      {confirmLogout && (
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
            bg="$color2"
            p="$5"
            br="$8"
            elevation="$6"
            zIndex={201}
            gap="$4"
            ai="center"
            bc="$color4"
            bw={1}
          >
            <Text fontSize={18} fontWeight="700" ta="center" mb="$2">
              Deseja realmente sair?
            </Text>
            <XStack gap="$3" jc="center">
              <Button theme="red" onPress={handleLogout}>
                Sim
              </Button>
              <Button variant="outlined" onPress={() => setConfirmLogout(false)}>
                Cancelar
              </Button>
            </XStack>
          </YStack>
        </YStack>
      )}
    </>
  )
}