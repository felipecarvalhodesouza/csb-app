import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  YStack,
  Text,
  Theme,
  useTheme,
  ScrollView,
  Image,
  Button
} from 'tamagui'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Footer from './footer'
import Header from './header'
import { Dimensions } from 'react-native'
import { Equipe } from './domain/equipe'

const { width: screenWidth } = Dimensions.get('window')
const placeholder = require('../assets/team.png')

export default function SelecionarEquipe() {
  const { torneio } = useLocalSearchParams()
  const router = useRouter()
  const theme = useTheme()

  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFavoriteAndFetch = async () => {
      const fav = await AsyncStorage.getItem('equipe_favorita')
      if (fav) {
        const equipe = JSON.parse(fav)
        router.replace(`/equipe?eq=${equipe.id}`)
        return
      }
      // Fetch teams if no favorite
      try {
        const user = await AsyncStorage.getItem('session_user');
        const headers = {
          'Authorization': `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        };
        const response = await fetch(`http://localhost:8080/torneios/${torneio}/equipes`, { headers })
        const data = await response.json() as Equipe[];
        setEquipes(data)
      } catch (e) {
        setEquipes([])
      } finally {
        setLoading(false)
      }
    }
    checkFavoriteAndFetch()
  }, [torneio])

  const handleConfirmar = async () => {
    const equipe = equipes.find((e) => e.id === selected)
    if (!equipe) return

    await AsyncStorage.setItem('equipe_favorita', JSON.stringify(equipe))
    router.replace(`/equipe?eq=${equipe.id}`)
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" jc="space-between" pb={"$9"} pt={"$6"}>
        <Header title="Selecione a sua equipe favorita" />

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {equipes.map((equipe) => (
            <YStack
              key={equipe.id}
              w={screenWidth}
              ai="center"
              jc="center"
              onPress={() => setSelected(equipe.id)}
              opacity={selected === equipe.id ? 1 : 0.6}
            >
              <Image
                source={equipe.imagemPath ? { uri: equipe.imagemPath } : placeholder}
                width={200}
                height={200}
                resizeMode="contain"
                br="$10"
              />
              <Text mt="$2" fontSize={18} fontWeight="500">
                {equipe.nome}
              </Text>
            </YStack>
          ))}
        </ScrollView>

        <Button
          mt="$4"
          mb="$4"
          w="100%"
          disabled={!selected}
          backgroundColor="black"
          color="white"
          onPress={handleConfirmar}
        >
          Confirmar seleção
        </Button>
        <Footer />
      </YStack>
    </Theme>
  )
}
