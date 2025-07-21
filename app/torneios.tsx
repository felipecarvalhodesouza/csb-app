import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
  ScrollView,
} from 'tamagui'
import Footer from './footer'
import Header from './header'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFavoriteModality } from '../utils/preferences'

export default function TorneiosScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [torneios, setTorneios] = useState<any[]>([])

  const loadTorneios = async () => {
    try {
      const user = await AsyncStorage.getItem('session_user')
      const headers = {
        'Authorization': `Bearer ${JSON.parse(user).token}`,
        'Content-Type': 'application/json',
      }

      const modality = await getFavoriteModality();

      const response = await fetch(`http://localhost:8080/torneios/modalidade/${modality}`, { headers })
      const data = await response.json()
      setTorneios(data)
    } catch (error) {
      console.error('Erro ao carregar torneios:', error)
    }
  }

  useEffect(() => {
    loadTorneios()
  }, [])

  const handleSelecionar = (torneioId: number) => {
    router.replace(`/categorias?torneio=${torneioId}`)
  }

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" jc="space-between" pb="$9" pt="$6">
        <Header title="Selecione o Torneio" />

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
          {torneios.map((torneio) => {
            const isEmAndamento = torneio.status === 'EM_ANDAMENTO'

            return (
              <XStack
                key={torneio.id}
                bg={isEmAndamento ? '$color1' : '$color2'}
                p="$4"
                br="$4"
                ai="center"
                onPress={() => handleSelecionar(torneio.id)}
                hoverStyle={{ bg: isEmAndamento ? '$color2' : '$color3' }}
                pressStyle={{ bg: isEmAndamento ? '$color3' : '$color4' }}
              >
                <View
                  bg={isEmAndamento ? '$blue10' : '$gray7'}
                  p="$3"
                  br="$10"
                  mr="$3"
                  ai="center"
                  jc="center"
                >
                  <MaterialCommunityIcons name="trophy" size={24} color={isEmAndamento ? "yellow" : "white"} />
                </View>

                <YStack>
                  <Text fontSize={16} color="white">{torneio.nome}</Text>
                  <Text fontSize={12} color="$gray10">
                    {isEmAndamento ? 'Torneio em andamento' : `Status: ${torneio.status}`}
                  </Text>
                </YStack>

                <View f={1} />
                <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
              </XStack>
            )
          })}
        </ScrollView>

        <Footer />
      </YStack>
    </Theme>
  )
}
