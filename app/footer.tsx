import { XStack, Text, Button, View } from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Footer() {
  const router = useRouter()
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
    { nome: 'Início', icone: 'home', ativo: false, rota: 'modalidades' },
    { nome: 'Torneios', icone: 'sports', ativo: true, rota: 'torneios' },
    { nome: 'Resultados', icone: 'leaderboard', ativo: false, rota: 'modalidades' },
    { nome: 'Logout', icone: 'settings', ativo: false, rota: 'login' },
  ]

  const tabs = perfil === 'ADMIN'
    ? [...tabsBase, { nome: 'Administração', icone: 'admin-panel-settings', ativo: false, rota: 'admin' }]
    : tabsBase

  return (
    <XStack
      bg="$color1"
      jc="space-evenly"
      ai="center"
      borderTopWidth={1}
      borderColor="$color4"
    >
      {tabs.map((tab) => (
        <View key={tab.nome} f={1} ai="stretch">
          <Button
            size="$3"
            circular={false}
            onPress={() => handleConfirmar(tab.rota)}
            fd="column"
            ai="center"
            jc="center"
            h="$6"
          >
            <MaterialIcons
              name={tab.icone as any}
              size={24}
              color={tab.ativo ? 'white' : '#999'}
            />
            <Text fontSize={8} color={tab.ativo ? 'white' : '#999'}>
              {tab.nome}
            </Text>
          </Button>
        </View>
      ))}
    </XStack>
  )
}
