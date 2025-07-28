import { useLocalSearchParams } from 'expo-router'
import {
  YStack,
  XStack,
  Text,
  Image,
  Theme,
  useTheme,
  ScrollView,
  Spinner,
} from 'tamagui'
import { useRouter } from 'expo-router'
import Footer from './footer'
import Header from './header'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Jogo from './domain/jogo'
import GameCard from './componente/game-card'

export default function CategoriaJogosScreen() {
  const { torneioId, categoriaId, nomeCategoria, nomeTorneio } = useLocalSearchParams<{ torneioId:string, categoriaId: string, nomeCategoria:string, nomeTorneio: string}>()
  const theme = useTheme()
  const router = useRouter()

  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJogos = async () => {
      try {
        setLoading(true)
        const user = await AsyncStorage.getItem('session_user')
        const headers = {
          Authorization: `Bearer ${JSON.parse(user).token}`,
          'Content-Type': 'application/json',
        }

        const response = await fetch(
          `http://192.168.1.11:8080/torneios/${torneioId}/categorias/${categoriaId}/jogos`,
          { headers }
        )

        if (!response.ok) {
          throw new Error('Erro ao buscar os jogos.')
        }

        const text = await response.text()

        if (text) {
        const data = JSON.parse(text) as Jogo[]
        setJogos(data)
        } else {
        setJogos([]) // ou algum fallback
        }
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido.')
      } finally {
        setLoading(false)
      }
    }

    if (categoriaId && torneioId) {
      fetchJogos()
    }
  }, [torneioId, categoriaId])

  const jogosAoVivo = jogos.filter((jogo) => jogo.transmissao?.toLowerCase() === 'live')
  const jogosNormais = jogos.filter((jogo) => jogo.transmissao?.toLowerCase() !== 'live')

  if (loading) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  if (error) {
    return (
      <YStack f={1} jc="center" ai="center">
        <Text color="$red10">{error}</Text>
      </YStack>
    )
  }

  return (
    <Theme name={theme.name}>
      <YStack f={1} bg="$background" jc="space-between" pb="$9" pt="$6">
        <Header title={nomeTorneio} subtitle={nomeCategoria}  />

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          space="$4"
        >
          {/* Ao Vivo */}
          {jogosAoVivo.length > 0 && (
            <YStack mb="$4" space>
              <Text fontSize={16} fontWeight="600" color="$red10">
                AO VIVO
              </Text>
              {jogosAoVivo.map((jogo) => (
                <GameCard key={jogo.id} jogo={jogo} onPress={() =>  router.push(`/jogo?id=${jogo.id}`)}/>
              ))}
            </YStack>
          )}

          {/* Demais jogos */}
          {jogosNormais.length > 0 ? (
            jogosNormais.map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} onPress={() =>  router.push(`/jogo?id=${jogo.id}`)}/>
            ))
          ) : (
            <YStack jc="center" ai="center" mt="$6">
              <Text fontSize="$4" color="$gray10">
                Categoria sem jogos vinculados.
              </Text>
            </YStack>
          )}
        </ScrollView>

        <Footer />
      </YStack>
    </Theme>
  )
}