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

export default function CategoriaJogosScreen() {
  const { torneioId, categoriaId } = useLocalSearchParams()
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
          `http://localhost:8080/torneios/${torneioId}/categorias/${categoriaId}/jogos`,
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
        <Header title="Jogos da Categoria" />

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

          {/* Demais jogos */}
          {jogosNormais.length > 0 ? (
            jogosNormais.map((jogo) => (
              <GameCard key={jogo.id} jogo={jogo} />
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
