import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  View,
  Theme,
  useTheme,
  ScrollView,
  Spinner,
} from 'tamagui'
import Footer from './footer'
import Header from './header'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFavoriteModality } from '../utils/preferences'

export default function SelecaoEquipesScreen() {
  const theme = useTheme()
  const router = useRouter()

  const [equipes, setEquipes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          Authorization: `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        const modality = await getFavoriteModality()
        
        if (!modality) {
          router.replace('/modalidades')
        }

        const response = await fetch(`http://192.168.1.11:8080/equipes?codigoModalidade=${modality}`, {
          headers,
        })

        if (!response.ok) throw new Error('Erro ao carregar equipes.')

        const data = await response.json()
        setEquipes(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchEquipes()
  }, [])

  const handleSelecionarEquipe = (equipeId: number, nomeEquipe: string) => {
    router.push(`/detalhes-equipe?id=${equipeId}&nome=${nomeEquipe}`)
  }

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" jc="space-between" pt="$6" pb="$9">
        <Header title="Selecione a Equipe" />

        {loading ? (
          <YStack f={1} jc="center" ai="center">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : equipes.length === 0 ? (
          <YStack f={1} jc="center" ai="center" px="$4">
            <Text fontSize={16} color="$gray10" textAlign="center">
              Nenhuma equipe cadastrada nessa categoria
            </Text>
          </YStack>
        ) : (
          <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }} space="$4">
            {equipes.map((equipe) => (
              <XStack
                key={equipe.id}
                bg="$color2"
                p="$4"
                br="$4"
                ai="center"
                onPress={() => handleSelecionarEquipe(equipe.id, equipe.nome)}
                hoverStyle={{ bg: '$color3' }}
                pressStyle={{ bg: '$color4' }}
              >
                <View
                  bg="$blue10"
                  p="$3"
                  br="$10"
                  mr="$3"
                  ai="center"
                  jc="center"
                >
                  <MaterialIcons name="groups" size={24} color="white" />
                </View>

                <YStack>
                  <Text fontSize={16} color="white">{equipe.nome}</Text>
                </YStack>

                <View f={1} />
                <MaterialIcons name="chevron-right" size={24} color="#ccc" />
              </XStack>
            ))}
          </ScrollView>
        )}

        <Footer />
      </YStack>
    </Theme>
  )
}
