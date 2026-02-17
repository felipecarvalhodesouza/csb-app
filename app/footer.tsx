import { XStack, Text, Button, View } from 'tamagui'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter, usePathname, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const [perfil, setPerfil] = useState<string | null>(null)
  const { mode } = useLocalSearchParams<{ mode: string }>() 

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

  const handleConfirmar = (rota: TabRota) => {
    router.replace(tabPathFromRota(rota) as any)
  }

  type TabRota = 'modalidades' | 'torneios' | 'equipes' | 'admin' | 'estatisticas';

  // Helper to map TabRota to valid path strings
  function tabPathFromRota(rota: TabRota): string {
    switch (rota) {
      case 'modalidades':
        return '/modalidades'
      case 'torneios':
        return '/torneios?mode=torneios'
      case 'equipes':
        return '/equipes'
      case 'admin':
        return '/admin'
      case 'estatisticas':
        return '/torneios?mode=estatisticas'
      default:
        return '/modalidades'
    }
  }
  
  type Tab = {
    nome: string;
    icone: string;
    rota: TabRota;
    path: string;
    community: boolean;
  }

  const tabsBase: Tab[] = [
    { nome: 'Início', icone: 'home', rota: 'modalidades', path: '/modalidades', community: false },
    { nome: 'Torneios', icone: 'trophy', rota: 'torneios', path: '/torneios', community: true },
    { nome: 'Equipes', icone: 'groups', rota: 'equipes', path: '/equipes', community: false },
    { nome: 'Estatísticas', icone: 'leaderboard', rota: 'estatisticas', path: '/estatisticas', community: false },
  ]

  const tabs: Tab[] = perfil === 'ADMIN'
    ? [...tabsBase, { nome: 'Admin', icone: 'admin-panel-settings', rota: 'admin', path: '/admin', community: false }]
    : tabsBase

  return (
    <XStack
      jc="space-evenly"
      ai="center"
    >
      {tabs.map((tab) => {
        const isEstatisticas = pathname == '/torneios' && mode === 'estatisticas'
        const isTorneios = pathname == '/torneios' && mode === 'torneios'
        const ativo = (pathname.startsWith(tab.path) && !isEstatisticas && !isTorneios) ||
                      (pathname == '/torneio-em-andamento' && tab.path == '/torneios') ||  
                      (tab.rota === 'estatisticas' && isEstatisticas) ||
                      (tab.rota === 'torneios' && isTorneios)
                      
        return (
          <View key={tab.nome} f={1} ai="stretch">
            <Button
              size="$3"
              onPress={() => handleConfirmar(tab.rota)}
              fd="column"
              ai="center"
              jc="center"
              h="$6"
              backgroundColor={"$color1"}
            >
              {!tab.community && (
                <MaterialIcons
                  name={tab.icone as any}
                  size={28}
                  color={ativo ? 'white' : '#999'}
                />
              )}
              {tab.community && (
                <MaterialCommunityIcons name={tab.icone as any} size={28} color={ativo ? 'white' : '#999'} />
              )}
              <Text
                fontSize={12}
                color={ativo ? 'white' : '#999'}
              >
                {tab.nome}
              </Text>
            </Button>
          </View>
        )
      })}
    </XStack>
  )
}