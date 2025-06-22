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

export default function HomeEquipe() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJogos = async (options: RequestInit = {}) => {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('session_user')
        const headers = {
          ...(options.headers || {}),
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json',
        }

        const response = await fetch(
          `http://localhost:8080/torneios/1/equipes/1/jogos`,
          { ...options, headers }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.message || 'Erro desconhecido ao buscar os jogos.'
          )
        }

        const data = (await response.json()) as Jogo[]
        setJogos(data)
      } catch (error) {
        console.error('Error fetching jogos:', error)
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchJogos()
  }, [])

  function agruparPorCategoria(jogos: Jogo[]) {
    const agrupado: { [categoriaNome: string]: Jogo[] } = {}

    jogos.forEach((jogo) => {
      const nomeCategoria = jogo.categoria?.nome || 'Sem Categoria'
      if (!agrupado[nomeCategoria]) {
        agrupado[nomeCategoria] = []
      }
      agrupado[nomeCategoria].push(jogo)
    })

    return agrupado
  }

  const jogosAoVivo = jogos.filter((jogo) => jogo.transmissao?.toLowerCase() === 'live')
  const jogosPorCategoria = agruparPorCategoria(
    jogos.filter((jogo) => jogo.transmissao?.toLowerCase() !== 'live')
  )

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
    <Theme name={theme}>
      <YStack f={1} bg="$background" jc="space-between" pb="$9" pt="$6">
        <Header title="Calendário de Jogos" />

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
                <GameCard key={jogo.id} jogo={jogo} destaque />
              ))}
            </YStack>
          )}

          {/* Demais jogos agrupados por categoria */}
          {Object.entries(jogosPorCategoria).map(([categoriaNome, jogosCategoria]) => (
            <YStack key={categoriaNome} space="$2" mt="$3">
              <Text fontWeight="600" fontSize={16} color="$gray10">
                {categoriaNome}
              </Text>
              {jogosCategoria.map((jogo) => (
                <GameCard key={jogo.id} jogo={jogo} />
              ))}
            </YStack>
          ))}
        </ScrollView>

        <Footer />
      </YStack>
    </Theme>
  )
}

function GameCard({ jogo, destaque }: { jogo: Jogo; destaque?: boolean }) {
  const bg = destaque ? '$gray5Dark' : '$gray3'
  const router = useRouter()

  const handlePress = () => {
    router.push(`/jogo?id=${jogo.id}`)
  }

  return (
    <YStack bg={bg} br="$3" p="$3" space="$2" onPress={handlePress} m="$2">

      <XStack jc="space-between" ai="center">
        <XStack ai="center" space="$2">
          <Image
              source={
              jogo.mandante.imagemPath
                ? { uri: jogo.mandante.imagemPath }
                : require('../assets/team.png')
              }
            width={40}
            height={40}
          />
          <Text fontWeight="600">{jogo.mandante.nome}</Text>
        </XStack>

        <Text fontSize={20} fontWeight="200">
          {jogo.transmissao?.toLowerCase() === 'live'
            ? 'AO VIVO'
            : jogo.data}
        </Text>

        <XStack ai="center" space="$2">
          <Text
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail"
            maxWidth={100}
          >
            {jogo.visitante.nome}
          </Text>
          <Image
              source={
              jogo.visitante.imagemPath
                ? { uri: jogo.visitante.imagemPath }
                : require('../assets/team.png')
              }
            width={40}
            height={40}
          />
        </XStack>
      </XStack>

      {jogo.transmissao && (
        <Text fontSize={11} color="$gray10">
          {jogo.transmissao}
        </Text>
      )}
    </YStack>
  )
}
