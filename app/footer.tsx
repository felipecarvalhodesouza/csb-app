import { XStack, Text, Button, View } from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter, usePathname } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const [perfil, setPerfil] = useState<string | null>(null)

  useEffect(() => {
    const fetchPerfil = async () => {
      const session = await AsyncStorage.getItem('session_user')
      if (session) {
        const user = JSON.parse(session)
        setPerfil(user.role)
      }
    }
    fetchPerfil()
  }, [])

  const handleConfirmar = (rota: string) => {
    router.replace(`/${rota}`)
  }

  const tabsBase = [
    { nome: 'Início', icone: 'home', rota: 'modalidades', path: '/modalidades' },
    { nome: 'Torneios', icone: 'sports', rota: 'torneios', path: '/torneios' },
    { nome: 'Equipes', icone: 'groups', rota: 'equipes', path: '/equipes' },
    { nome: 'Estatísticas', icone: 'leaderboard', rota: 'modalidades', path: '/estatisticas' },
    { nome: 'Logout', icone: 'settings', rota: 'login', path: '/login' },
  ]

  const tabs = perfil === 'ADMIN'
    ? [...tabsBase, { nome: 'Administração', icone: 'admin-panel-settings', rota: 'admin', path: '/admin' }]
    : tabsBase

  return (
    <XStack>
      {tabs.map((tab) => {
        const ativo = pathname.startsWith(tab.path)
        return (
          <View key={tab.nome} f={1}>
            <Button
              size="$6"
              onPress={() => handleConfirmar(tab.rota)}
              backgroundColor={'$color1'}
            >
              <MaterialIcons
                name={tab.icone as any}
                size={32}
                color={ativo ? 'white' : '#999'}
              />
            </Button>
          </View>
        )
      })}
    </XStack>
  )
}
