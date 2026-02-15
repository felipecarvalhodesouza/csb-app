import { useState, useEffect } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import { Star } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { apiFetch } from './utils/api'
import Equipe from './domain/equipe'
import { API_BASE_URL } from '../utils/config'
import LeftDrawer from './componente/LeftDrawer'
import RightDrawer from './componente/RightDrawer'

type HeaderProps = {
  title: string
  subtitle?: string
  equipe?: any
  button?: React.ReactNode
  button2?: React.ReactNode
}

export default function Header({
  title,
  subtitle,
  equipe,
  button,
  button2
}: HeaderProps) {
  const [leftOpen, setLeftOpen] = useState(false)
  const [rightOpen, setRightOpen] = useState(false)
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
      const equipeResponse = await apiFetch<Equipe>(
        `${API_BASE_URL}/equipes/${equipe}`
      )
      await AsyncStorage.setItem(
        'equipe_favorita',
        JSON.stringify(equipeResponse)
      )
      setFavorito(true)
    }
  }

  const handleLogout = async () => {
    setRightOpen(false)
    await AsyncStorage.removeItem('session_user')
    router.replace('/login')
  }

  return (
    <>
      <YStack px="$4" pt="$2" pb="$3" bg="$background">
        <XStack jc="space-between" ai="center">
          
          {/* Botão esquerdo */}
          {!button && !equipe && (
            <Button
              size="$3"
              onPress={() => setLeftOpen(true)}
              backgroundColor="$color1"
            >
              <MaterialIcons name="menu" size={26} color="white" />
            </Button>
          )}

          {button && <>{button}</>}

          {!button && equipe && (
            <Button chromeless onPress={handleToggleFavorito}>
              <Star
                color={favorito ? 'yellow' : 'black'}
                fill={favorito ? 'yellow' : 'transparent'}
                stroke={favorito ? 'yellow' : 'white'}
                size={24}
              />
            </Button>
          )}

          {/* Centro */}
          <YStack f={1} ai="center">
            <Text fontSize={16} fontWeight="600" ta="center">
              {title}
            </Text>
            {subtitle && (
              <Text fontSize={12} color="$gray10" ta="center">
                {subtitle}
              </Text>
            )}
          </YStack>

          {/* Botão direito */}
          {button2 ? (
            button2
          ) : (
            <Button
              chromeless
              onPress={() => setRightOpen(true)}
            >
              <MaterialIcons
                name="account-circle"
                size={28}
                color="white"
              />
            </Button>
          )}
        </XStack>
      </YStack>

      <LeftDrawer open={leftOpen} onClose={() => setLeftOpen(false)} />

      <RightDrawer
        open={rightOpen}
        onClose={() => setRightOpen(false)}
        onLogout={handleLogout}
      />
    </>
  )
}
